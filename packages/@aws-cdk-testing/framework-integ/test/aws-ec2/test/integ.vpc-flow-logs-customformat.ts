import { Bucket } from 'aws-cdk-lib/aws-s3';
import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc, LogFormat } from 'aws-cdk-lib/aws-ec2';

const app = new App();


class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC');

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      logFormat: [
        LogFormat.SRC_PORT,
      ],
    });

    const bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    vpc.addFlowLog('FlowLogsS3', {
      destination: FlowLogDestination.toS3(bucket, 'prefix/'),
      logFormat: [
        LogFormat.DST_PORT,
        LogFormat.SRC_PORT,
      ],
    });

  }
}


new IntegTest(app, 'FlowLogs', {
  testCases: [
    new TestStack(app, 'FlowLogsTestStack'),
  ],
});

app.synth();
