"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
class EksClusterInferenceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            albController: {
                version: eks.AlbControllerVersion.V2_4_1,
            },
        });
        cluster.addAutoScalingGroupCapacity('InferenceInstances', {
            instanceType: new ec2.InstanceType('inf1.2xlarge'),
            minCapacity: 1,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWluZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1pbmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLDZDQUF5QztBQUN6QyxvREFBb0Q7QUFDcEQscUZBQTJFO0FBQzNFLDJDQUEyQztBQUUzQyxNQUFNLHdCQUF5QixTQUFRLG1CQUFLO0lBRTFDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpREFBaUQ7UUFDakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQy9DLEdBQUc7WUFDSCxHQUFHLHdEQUF1QixDQUFDLElBQUksQ0FBQztZQUNoQyxhQUFhLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLDJCQUEyQixDQUFDLG9CQUFvQixFQUFFO1lBQ3hELFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO1lBQ2xELFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztBQUN0RixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLCtCQUErQixFQUFFO0lBQ3hELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQixpQkFBaUIsRUFBRTtRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBnZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyB9IGZyb20gJy4vaW50ZWctdGVzdHMta3ViZXJuZXRlcy12ZXJzaW9uJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWtzJztcblxuY2xhc3MgRWtzQ2x1c3RlckluZmVyZW5jZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uZ2V0Q2x1c3RlclZlcnNpb25Db25maWcodGhpcyksXG4gICAgICBhbGJDb250cm9sbGVyOiB7XG4gICAgICAgIHZlcnNpb246IGVrcy5BbGJDb250cm9sbGVyVmVyc2lvbi5WMl80XzEsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ0luZmVyZW5jZUluc3RhbmNlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2luZjEuMnhsYXJnZScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlckluZmVyZW5jZVN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItaW5mZXJlbmNlLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1pbnRlcmVuY2UnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19