"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const app = new aws_cdk_lib_1.App();
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new aws_ec2_1.Vpc(this, 'VPC');
        new aws_ec2_1.FlowLog(this, 'FlowLogsCW', {
            resourceType: aws_ec2_1.FlowLogResourceType.fromVpc(vpc),
            logFormat: [
                aws_ec2_1.LogFormat.SRC_PORT,
            ],
        });
        const bucket = new aws_s3_1.Bucket(this, 'Bucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        vpc.addFlowLog('FlowLogsS3', {
            destination: aws_ec2_1.FlowLogDestination.toS3(bucket, 'prefix/'),
            logFormat: [
                aws_ec2_1.LogFormat.DST_PORT,
                aws_ec2_1.LogFormat.SRC_PORT,
            ],
        });
    }
}
new integ_tests_alpha_1.IntegTest(app, 'FlowLogs', {
    testCases: [
        new TestStack(app, 'FlowLogsTestStack'),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWZsb3ctbG9ncy1jdXN0b21mb3JtYXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy52cGMtZmxvdy1sb2dzLWN1c3RvbWZvcm1hdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUE0QztBQUM1Qyw2Q0FBb0U7QUFDcEUsa0VBQXVEO0FBQ3ZELGlEQUF1RztBQUV2RyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUd0QixNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpDLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlCLFlBQVksRUFBRSw2QkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzlDLFNBQVMsRUFBRTtnQkFDVCxtQkFBUyxDQUFDLFFBQVE7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3hDLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUMzQixXQUFXLEVBQUUsNEJBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7WUFDdkQsU0FBUyxFQUFFO2dCQUNULG1CQUFTLENBQUMsUUFBUTtnQkFDbEIsbUJBQVMsQ0FBQyxRQUFRO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBR0QsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7SUFDN0IsU0FBUyxFQUFFO1FBQ1QsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDO0tBQ3hDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBGbG93TG9nLCBGbG93TG9nRGVzdGluYXRpb24sIEZsb3dMb2dSZXNvdXJjZVR5cGUsIFZwYywgTG9nRm9ybWF0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyh0aGlzLCAnVlBDJyk7XG5cbiAgICBuZXcgRmxvd0xvZyh0aGlzLCAnRmxvd0xvZ3NDVycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tVnBjKHZwYyksXG4gICAgICBsb2dGb3JtYXQ6IFtcbiAgICAgICAgTG9nRm9ybWF0LlNSQ19QT1JULFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ0J1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuICAgIHZwYy5hZGRGbG93TG9nKCdGbG93TG9nc1MzJywge1xuICAgICAgZGVzdGluYXRpb246IEZsb3dMb2dEZXN0aW5hdGlvbi50b1MzKGJ1Y2tldCwgJ3ByZWZpeC8nKSxcbiAgICAgIGxvZ0Zvcm1hdDogW1xuICAgICAgICBMb2dGb3JtYXQuRFNUX1BPUlQsXG4gICAgICAgIExvZ0Zvcm1hdC5TUkNfUE9SVCxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfVxufVxuXG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnRmxvd0xvZ3MnLCB7XG4gIHRlc3RDYXNlczogW1xuICAgIG5ldyBUZXN0U3RhY2soYXBwLCAnRmxvd0xvZ3NUZXN0U3RhY2snKSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==