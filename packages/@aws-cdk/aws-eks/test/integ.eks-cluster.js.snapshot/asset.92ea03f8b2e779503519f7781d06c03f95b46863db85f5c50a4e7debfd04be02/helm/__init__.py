import json
import logging
import os
import re
import subprocess
import shutil
import tempfile
import zipfile

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/helm:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')

def get_chart_asset_from_url(chart_asset_url):
    chart_zip = os.path.join(outdir, 'chart.zip')
    shutil.rmtree(chart_zip, ignore_errors=True)
    subprocess.check_call(['aws', 's3', 'cp', chart_asset_url, chart_zip])
    chart_dir = os.path.join(outdir, 'chart')
    shutil.rmtree(chart_dir, ignore_errors=True)
    os.mkdir(chart_dir)
    with zipfile.ZipFile(chart_zip, 'r') as zip_ref:
        zip_ref.extractall(chart_dir)
    return chart_dir

def helm_handler(event, context):
    logger.info(json.dumps(dict(event, ResponseURL='...')))

    request_type = event['RequestType']
    props = event['ResourceProperties']

    # resource properties
    cluster_name     = props['ClusterName']
    role_arn         = props['RoleArn']
    release          = props['Release']
    chart            = props.get('Chart', None)
    chart_asset_url  = props.get('ChartAssetURL', None)
    version          = props.get('Version', None)
    wait             = props.get('Wait', False)
    timeout          = props.get('Timeout', None)
    namespace        = props.get('Namespace', None)
    create_namespace = props.get('CreateNamespace', None)
    repository       = props.get('Repository', None)
    values_text      = props.get('Values', None)
    skip_crds        = props.get('SkipCrds', False)

    # "log in" to the cluster
    subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
        '--role-arn', role_arn,
        '--name', cluster_name,
        '--kubeconfig', kubeconfig
    ])

    if os.path.isfile(kubeconfig):
        os.chmod(kubeconfig, 0o600)

    # Write out the values to a file and include them with the install and upgrade
    values_file = None
    if request_type != "Delete" and values_text is not None:
        values = json.loads(values_text)
        values_file = os.path.join(outdir, 'values.yaml')
        with open(values_file, "w") as f:
            f.write(json.dumps(values, indent=2))

    if request_type in ['Create', 'Update']:
        # Ensure chart or chart_asset_url are set
        if chart is None and chart_asset_url is None:
            raise RuntimeError('chart or chartAsset must be specified')

        if chart_asset_url != None:
            assert chart is None
            assert repository is None
            assert version is None
            if not chart_asset_url.startswith('s3://'):
              raise RuntimeError(f'ChartAssetURL must point to as s3 location but is {chart_asset_url}')
            # future work: support versions from s3 assets
            chart = get_chart_asset_from_url(chart_asset_url)

        if repository is not None and repository.startswith('oci://'):
            tmpdir = tempfile.TemporaryDirectory()
            chart_dir = get_chart_from_oci(tmpdir.name, repository, version)
            chart = chart_dir

        helm('upgrade', release, chart, repository, values_file, namespace, version, wait, timeout, create_namespace)
    elif request_type == "Delete":
        try:
            helm('uninstall', release, namespace=namespace, timeout=timeout)
        except Exception as e:
            logger.info(f"delete error: {e}")


def get_oci_cmd(repository, version):
    # Generates OCI command based on pattern. Public ECR vs Private ECR are treated differently.
    private_ecr_pattern = 'oci://(?P<registry>\d+.dkr.ecr.(?P<region>[a-z]+-[a-z]+-\d).amazonaws.com)*'
    public_ecr_pattern = 'oci://(?P<registry>public.ecr.aws)*'

    private_registry = re.match(private_ecr_pattern, repository).groupdict()
    public_registry = re.match(public_ecr_pattern, repository).groupdict()

    if private_registry['registry'] is not None:
        logger.info("Found AWS private repository")
        return [
            f"aws ecr get-login-password --region {private_registry['region']} | "
            f"helm registry login --username AWS --password-stdin {private_registry['registry']}; helm pull {repository} --version {version} --untar"
        ]
    elif public_registry['registry'] is not None:
        logger.info("Found AWS public repository, will use default region as deployment")
        region = os.environ.get('AWS_REGION', 'us-east-1')

        return [
            f"aws ecr-public get-login-password --region us-east-1 | "
            f"helm registry login --username AWS --password-stdin {public_registry['registry']}; helm pull {repository} --version {version} --untar"
        ]
    else:
        logger.error("OCI repository format not recognized, falling back to helm pull")
        return ['helm', 'pull', repository, '--version', version, '--untar']


def get_chart_from_oci(tmpdir, repository = None, version = None):

    cmnd = get_oci_cmd(repository, version)

    maxAttempts = 3
    retry = maxAttempts
    while retry > 0:
        try:
            logger.info(cmnd)
            output = subprocess.check_output(cmnd, stderr=subprocess.STDOUT, cwd=tmpdir, shell=True)
            logger.info(output)

            # effectively returns "$tmpDir/$lastPartOfOCIUrl", because this is how helm pull saves OCI artifact. 
            # Eg. if we have oci://9999999999.dkr.ecr.us-east-1.amazonaws.com/foo/bar/pet-service repository, helm saves artifact under $tmpDir/pet-service
            return os.path.join(tmpdir, repository.rpartition('/')[-1])
        except subprocess.CalledProcessError as exc:
            output = exc.output
            if b'Broken pipe' not in output:
                raise Exception(output)
            retry -= 1
            logger.info(f"Broken pipe, retries left: {retry}")
    raise Exception(f'Operation failed after {maxAttempts} attempts: {output}')


def helm(verb, release, chart = None, repo = None, file = None, namespace = None, version = None, wait = False, timeout = None, create_namespace = None, skip_crds = False):
    import subprocess

    cmnd = ['helm', verb, release]
    if chart is not None:
        cmnd.append(chart)
    if verb == 'upgrade':
        cmnd.append('--install')
    if create_namespace:
        cmnd.append('--create-namespace')
    if repo is not None:
        cmnd.extend(['--repo', repo])
    if file is not None:
        cmnd.extend(['--values', file])
    if version is not None:
        cmnd.extend(['--version', version])
    if namespace is not None:
        cmnd.extend(['--namespace', namespace])
    if wait:
        cmnd.append('--wait')
    if skip_crds:
        cmnd.append('--skip-crds')
    if timeout is not None:
        cmnd.extend(['--timeout', timeout])
    cmnd.extend(['--kubeconfig', kubeconfig])

    maxAttempts = 3
    retry = maxAttempts
    while retry > 0:
        try:
            output = subprocess.check_output(cmnd, stderr=subprocess.STDOUT, cwd=outdir)
            logger.info(output)
            return
        except subprocess.CalledProcessError as exc:
            output = exc.output
            if b'Broken pipe' not in output:
                raise Exception(output)
            retry -= 1
            logger.info(f"Broken pipe, retries left: {retry}")
    raise Exception(f'Operation failed after {maxAttempts} attempts: {output}')
