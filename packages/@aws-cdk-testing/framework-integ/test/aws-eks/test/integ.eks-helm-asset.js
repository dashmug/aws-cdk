"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
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
            defaultCapacity: 2,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            tags: {
                foo: 'bar',
            },
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
        });
        this.assertHelmChartAsset();
    }
    assertHelmChartAsset() {
        // get helm chart from Asset
        const chartAsset = new aws_s3_assets_1.Asset(this, 'ChartAsset', {
            path: path.join(__dirname, 'test-chart'),
        });
        this.cluster.addHelmChart('test-chart', {
            chartAsset: chartAsset,
        });
        this.cluster.addHelmChart('test-oci-chart', {
            chart: 's3-chart',
            release: 's3-chart',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
            version: 'v0.1.0',
            namespace: 'ack-system',
            createNamespace: true,
        });
        // there is no opinionated way of testing charts from private ECR, so there is description of manual steps needed to reproduce:
        // 1. `export AWS_PROFILE=youraccountprofile; aws ecr create-repository --repository-name helm-charts-test/s3-chart --region YOUR_REGION`
        // 2. `helm pull oci://public.ecr.aws/aws-controllers-k8s/s3-chart --version v0.1.0`
        // 3. Login to ECR (howto: https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html )
        // 4. `helm push s3-chart-v0.1.0.tgz oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test/`
        // 5. Change `repository` in above test to oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test
        // 6. Run integration tests as usual
        this.cluster.addHelmChart('test-oci-chart-different-release-name', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
        });
        // testing the disable mechanism of the installation of CRDs
        this.cluster.addHelmChart('test-skip-crd-installation', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
            skipCrds: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWhlbG0tYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtaGVsbS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2REFBa0Q7QUFDbEQsNkNBQXlDO0FBQ3pDLG9EQUFvRDtBQUNwRCxxRkFBMkU7QUFDM0UsMkNBQTJDO0FBRTNDLE1BQU0sZUFBZ0IsU0FBUSxtQkFBSztJQUlqQyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsNEVBQTRFO1FBQzVFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzlDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVc7WUFDWCxlQUFlLEVBQUUsQ0FBQztZQUNsQixHQUFHLHdEQUF1QixDQUFDLElBQUksQ0FBQztZQUNoQyxJQUFJLEVBQUU7Z0JBQ0osR0FBRyxFQUFFLEtBQUs7YUFDWDtZQUNELGNBQWMsRUFBRTtnQkFDZCxHQUFHLENBQUMsbUJBQW1CLENBQUMsR0FBRztnQkFDM0IsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGFBQWE7Z0JBQ3JDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQiw0QkFBNEI7UUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUU7WUFDdEMsVUFBVSxFQUFFLFVBQVU7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLFVBQVU7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLG1EQUFtRDtZQUMvRCxPQUFPLEVBQUUsUUFBUTtZQUNqQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtTQUN0QixDQUFDLENBQUM7UUFFSCwrSEFBK0g7UUFDL0gseUlBQXlJO1FBQ3pJLG9GQUFvRjtRQUNwRiwwR0FBMEc7UUFDMUcsK0dBQStHO1FBQy9HLG1IQUFtSDtRQUNuSCxvQ0FBb0M7UUFFcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsdUNBQXVDLEVBQUU7WUFDakUsS0FBSyxFQUFFLGNBQWM7WUFDckIsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixVQUFVLEVBQUUsdURBQXVEO1lBQ25FLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUMsQ0FBQztRQUVILDREQUE0RDtRQUM1RCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsRUFBRTtZQUN0RCxLQUFLLEVBQUUsY0FBYztZQUNyQixPQUFPLEVBQUUsc0JBQXNCO1lBQy9CLFVBQVUsRUFBRSx1REFBdUQ7WUFDbkUsT0FBTyxFQUFFLFFBQVE7WUFDakIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUNoRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFO0lBQzNDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHByaXZhdGUgY2x1c3RlcjogZWtzLkNsdXN0ZXI7XG4gIHByaXZhdGUgdnBjOiBlYzIuSVZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIGFsbG93IGFsbCBhY2NvdW50IHVzZXJzIHRvIGFzc3VtZSB0aGlzIHJvbGUgaW4gb3JkZXIgdG8gYWRtaW4gdGhlIGNsdXN0ZXJcbiAgICBjb25zdCBtYXN0ZXJzUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgdGhpcy52cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBuYXRHYXRld2F5czogMSB9KTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2x1c3RlciB3aXRoIGEgZGVmYXVsdCBub2RlZ3JvdXAgY2FwYWNpdHlcbiAgICB0aGlzLmNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIHRhZ3M6IHtcbiAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgICBjbHVzdGVyTG9nZ2luZzogW1xuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5BUEksXG4gICAgICAgIGVrcy5DbHVzdGVyTG9nZ2luZ1R5cGVzLkFVVEhFTlRJQ0FUT1IsXG4gICAgICAgIGVrcy5DbHVzdGVyTG9nZ2luZ1R5cGVzLlNDSEVEVUxFUixcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFzc2VydEhlbG1DaGFydEFzc2V0KCk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydEhlbG1DaGFydEFzc2V0KCkge1xuICAgIC8vIGdldCBoZWxtIGNoYXJ0IGZyb20gQXNzZXRcbiAgICBjb25zdCBjaGFydEFzc2V0ID0gbmV3IEFzc2V0KHRoaXMsICdDaGFydEFzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3QtY2hhcnQnKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LWNoYXJ0Jywge1xuICAgICAgY2hhcnRBc3NldDogY2hhcnRBc3NldCxcbiAgICB9KTtcblxuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3Qtb2NpLWNoYXJ0Jywge1xuICAgICAgY2hhcnQ6ICdzMy1jaGFydCcsXG4gICAgICByZWxlYXNlOiAnczMtY2hhcnQnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvczMtY2hhcnQnLFxuICAgICAgdmVyc2lvbjogJ3YwLjEuMCcsXG4gICAgICBuYW1lc3BhY2U6ICdhY2stc3lzdGVtJyxcbiAgICAgIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIHRoZXJlIGlzIG5vIG9waW5pb25hdGVkIHdheSBvZiB0ZXN0aW5nIGNoYXJ0cyBmcm9tIHByaXZhdGUgRUNSLCBzbyB0aGVyZSBpcyBkZXNjcmlwdGlvbiBvZiBtYW51YWwgc3RlcHMgbmVlZGVkIHRvIHJlcHJvZHVjZTpcbiAgICAvLyAxLiBgZXhwb3J0IEFXU19QUk9GSUxFPXlvdXJhY2NvdW50cHJvZmlsZTsgYXdzIGVjciBjcmVhdGUtcmVwb3NpdG9yeSAtLXJlcG9zaXRvcnktbmFtZSBoZWxtLWNoYXJ0cy10ZXN0L3MzLWNoYXJ0IC0tcmVnaW9uIFlPVVJfUkVHSU9OYFxuICAgIC8vIDIuIGBoZWxtIHB1bGwgb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9zMy1jaGFydCAtLXZlcnNpb24gdjAuMS4wYFxuICAgIC8vIDMuIExvZ2luIHRvIEVDUiAoaG93dG86IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1IvbGF0ZXN0L3VzZXJndWlkZS9wdXNoLW9jaS1hcnRpZmFjdC5odG1sIClcbiAgICAvLyA0LiBgaGVsbSBwdXNoIHMzLWNoYXJ0LXYwLjEuMC50Z3ogb2NpOi8vWU9VUl9BQ0NPVU5UX0lELmRrci5lY3IuWU9VUl9SRUdJT04uYW1hem9uYXdzLmNvbS9oZWxtLWNoYXJ0cy10ZXN0L2BcbiAgICAvLyA1LiBDaGFuZ2UgYHJlcG9zaXRvcnlgIGluIGFib3ZlIHRlc3QgdG8gb2NpOi8vWU9VUl9BQ0NPVU5UX0lELmRrci5lY3IuWU9VUl9SRUdJT04uYW1hem9uYXdzLmNvbS9oZWxtLWNoYXJ0cy10ZXN0XG4gICAgLy8gNi4gUnVuIGludGVncmF0aW9uIHRlc3RzIGFzIHVzdWFsXG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LW9jaS1jaGFydC1kaWZmZXJlbnQtcmVsZWFzZS1uYW1lJywge1xuICAgICAgY2hhcnQ6ICdsYW1iZGEtY2hhcnQnLFxuICAgICAgcmVsZWFzZTogJ2xhbWJkYS1jaGFydC1yZWxlYXNlJyxcbiAgICAgIHJlcG9zaXRvcnk6ICdvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzL2xhbWJkYS1jaGFydCcsXG4gICAgICB2ZXJzaW9uOiAndjAuMS40JyxcbiAgICAgIG5hbWVzcGFjZTogJ2Fjay1zeXN0ZW0nLFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gdGVzdGluZyB0aGUgZGlzYWJsZSBtZWNoYW5pc20gb2YgdGhlIGluc3RhbGxhdGlvbiBvZiBDUkRzXG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1za2lwLWNyZC1pbnN0YWxsYXRpb24nLCB7XG4gICAgICBjaGFydDogJ2xhbWJkYS1jaGFydCcsXG4gICAgICByZWxlYXNlOiAnbGFtYmRhLWNoYXJ0LXJlbGVhc2UnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICd2MC4xLjQnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgICBza2lwQ3JkczogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1oZWxtLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtaGVsbScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19