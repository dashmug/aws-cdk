import subprocess as sp
import os
import logging

#https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-stepfunctions#custom-state
def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    if event['RequestType'] in ['Create', 'Update']:
        command = ["/opt/awscli/aws", "emr-containers", "update-role-trust-policy", "--cluster-name", f"{event['ResourceProperties']['eksClusterId']}", "--namespace", f"{event['ResourceProperties']['eksNamespace']}", "--role-name", f"{event['ResourceProperties']['roleName']}"]
        try:
            res = sp.check_output(command)
            logger.info(f"Successfully ran {command}")
        except Exception as e:
            logger.info(f"ERROR: {str(e)}")
            