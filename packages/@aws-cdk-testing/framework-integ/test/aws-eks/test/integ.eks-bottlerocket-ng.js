"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole,
            defaultCapacity: 0,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
        });
        this.cluster.addNodegroupCapacity('BottlerocketNG1', {
            amiType: aws_eks_1.NodegroupAmiType.BOTTLEROCKET_X86_64,
        });
        this.cluster.addNodegroupCapacity('BottlerocketNG2', {
            amiType: aws_eks_1.NodegroupAmiType.BOTTLEROCKET_ARM_64,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-bottlerocket-ng-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-bottlerocket-ng', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWJvdHRsZXJvY2tldC1uZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1ib3R0bGVyb2NrZXQtbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBeUM7QUFDekMsb0RBQW9EO0FBQ3BELHFGQUEyRTtBQUMzRSwyQ0FBMkM7QUFDM0MsaURBQXVEO0FBRXZELE1BQU0sZUFBZ0IsU0FBUSxtQkFBSztJQUtqQyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsNEVBQTRFO1FBQzVFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzlDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVc7WUFDWCxlQUFlLEVBQUUsQ0FBQztZQUNsQixHQUFHLHdEQUF1QixDQUFDLElBQUksQ0FBQztTQUNqQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFO1lBQ25ELE9BQU8sRUFBRSwwQkFBZ0IsQ0FBQyxtQkFBbUI7U0FDOUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRTtZQUNuRCxPQUFPLEVBQUUsMEJBQWdCLENBQUMsbUJBQW1CO1NBQzlDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO0FBQ25GLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUNBQXFDLEVBQUU7SUFDOUQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0IHsgTm9kZWdyb3VwQW1pVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIC4uLmdldENsdXN0ZXJWZXJzaW9uQ29uZmlnKHRoaXMpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXRORzEnLCB7XG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9YODZfNjQsXG4gICAgfSk7XG4gICAgdGhpcy5jbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXRORzInLCB7XG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9BUk1fNjQsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1ib3R0bGVyb2NrZXQtbmctdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLWJvdHRsZXJvY2tldC1uZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==