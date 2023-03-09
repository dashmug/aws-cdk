"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
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
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            mastersRole,
            defaultCapacity: 2,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            endpointAccess: eks.EndpointAccess.PRIVATE,
            prune: false,
        });
        // this is the valdiation. it won't work if the private access is not setup properly.
        cluster.addManifest('config-map', {
            kind: 'ConfigMap',
            apiVersion: 'v1',
            data: {
                hello: 'world',
            },
            metadata: {
                name: 'config-map',
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-private-endpoint-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-private-endpoint', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXItcHJpdmF0ZS1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2Q0FBeUM7QUFDekMsb0RBQW9EO0FBQ3BELHFGQUEyRTtBQUMzRSwyQ0FBMkM7QUFFM0MsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ2pDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw0RUFBNEU7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGlEQUFpRDtRQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsR0FBRztZQUNILFdBQVc7WUFDWCxlQUFlLEVBQUUsQ0FBQztZQUNsQixHQUFHLHdEQUF1QixDQUFDLElBQUksQ0FBQztZQUNoQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPO1lBQzFDLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO1FBRUgscUZBQXFGO1FBQ3JGLE9BQU8sQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFO1lBQ2hDLElBQUksRUFBRSxXQUFXO1lBQ2pCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsT0FBTzthQUNmO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxZQUFZO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBR0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLDJDQUEyQyxDQUFDLENBQUM7QUFDcEYsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsRUFBRTtJQUMvRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgZ2V0Q2x1c3RlclZlcnNpb25Db25maWcgfSBmcm9tICcuL2ludGVnLXRlc3RzLWt1YmVybmV0ZXMtdmVyc2lvbic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBhbGxvdyBhbGwgYWNjb3VudCB1c2VycyB0byBhc3N1bWUgdGhpcyByb2xlIGluIG9yZGVyIHRvIGFkbWluIHRoZSBjbHVzdGVyXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIHRoaXMgaXMgdGhlIHZhbGRpYXRpb24uIGl0IHdvbid0IHdvcmsgaWYgdGhlIHByaXZhdGUgYWNjZXNzIGlzIG5vdCBzZXR1cCBwcm9wZXJseS5cbiAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdjb25maWctbWFwJywge1xuICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgZGF0YToge1xuICAgICAgICBoZWxsbzogJ3dvcmxkJyxcbiAgICAgIH0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnY29uZmlnLW1hcCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH1cbn1cblxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQtdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==