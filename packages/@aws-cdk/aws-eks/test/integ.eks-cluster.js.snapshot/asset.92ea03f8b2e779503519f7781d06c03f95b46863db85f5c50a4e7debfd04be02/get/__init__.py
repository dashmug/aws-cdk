import json
import logging
import os
import subprocess
import time

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# these are coming from the kubectl layer
os.environ['PATH'] = '/opt/kubectl:/opt/awscli:' + os.environ['PATH']

outdir = os.environ.get('TEST_OUTDIR', '/tmp')
kubeconfig = os.path.join(outdir, 'kubeconfig')


def get_handler(event, context):
    logger.info(json.dumps(dict(event, ResponseURL='...')))

    request_type = event['RequestType']
    props = event['ResourceProperties']

    # resource properties (all required)
    cluster_name  = props['ClusterName']
    role_arn      = props['RoleArn']

    # "log in" to the cluster
    subprocess.check_call([ 'aws', 'eks', 'update-kubeconfig',
        '--role-arn', role_arn,
        '--name', cluster_name,
        '--kubeconfig', kubeconfig
    ])

    if os.path.isfile(kubeconfig):
        os.chmod(kubeconfig, 0o600)

    json_path           = props['JsonPath']
    # json path should be surrouded with '{}'
    path = '{{{0}}}'.format(json_path)
    if request_type in ['Create', 'Update']:
        object_type         = props['ObjectType']
        object_name         = props['ObjectName']
        object_namespace    = props['ObjectNamespace']
        timeout_seconds     = props['TimeoutSeconds']

        output = wait_for_output(['get', '-n', object_namespace, object_type, object_name, "-o=jsonpath='{{{0}}}'".format(json_path)], int(timeout_seconds))
        return {'Data': {'Value': output}}
    elif request_type != 'Delete':
        raise Exception(f"invalid request type {request_type}")

def wait_for_output(args, timeout_seconds):

    end_time = time.time() + timeout_seconds
    error = None

    while time.time() < end_time:
        try:
            if output := kubectl(args).decode('utf-8')[1:-1]:
                return output
        except Exception as e:
            error = str(e)
        time.sleep(10)

    raise RuntimeError(f'Timeout waiting for output from kubectl command: {args} (last_error={error})')

def kubectl(args):
    retry = 3
    while retry > 0:
        try:
            cmd = [ 'kubectl', '--kubeconfig', kubeconfig ] + args
            output = subprocess.check_output(cmd, stderr=subprocess.PIPE)
        except subprocess.CalledProcessError as exc:
            output = exc.output + exc.stderr
            if b'i/o timeout' not in output or retry <= 0:
                raise Exception(output)
            logger.info(f"kubectl timed out, retries left: {retry}")
            retry -= 1
        else:
            logger.info(output)
            return output