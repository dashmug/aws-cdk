"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-24");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const pinger_1 = require("./pinger/pinger");
const eks = require("aws-cdk-lib/aws-eks");
class EksClusterAlbControllerStack extends aws_cdk_lib_1.Stack {
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
        const chart = new cdk8s.Chart(new cdk8s.App(), 'hello-server');
        const ingress = new kplus.Deployment(chart, 'Deployment', {
            containers: [{
                    image: 'hashicorp/http-echo',
                    args: ['-text', 'hello'],
                    port: 5678,
                    securityContext: {
                        user: 1005,
                    },
                }],
        })
            .exposeViaService({ serviceType: kplus.ServiceType.NODE_PORT })
            .exposeViaIngress('/');
        // allow vpc to access the ELB so our pinger can hit it.
        ingress.metadata.addAnnotation('alb.ingress.kubernetes.io/inbound-cidrs', cluster.vpc.vpcCidrBlock);
        const echoServer = cluster.addCdk8sChart('echo-server', chart, { ingressAlb: true, ingressAlbScheme: eks.AlbScheme.INTERNAL });
        // the deletion of `echoServer` is what instructs the controller to delete the ELB.
        // so we need to make sure this happens before the controller is deleted.
        echoServer.node.addDependency(cluster.albController ?? []);
        const loadBalancerAddress = cluster.getIngressLoadBalancerAddress(ingress.name, { timeout: aws_cdk_lib_1.Duration.minutes(10) });
        // create a resource that hits the load balancer to make sure
        // everything is wired properly.
        const pinger = new pinger_1.Pinger(this, 'IngressPinger', {
            url: `http://${loadBalancerAddress}`,
            vpc: cluster.vpc,
        });
        // the pinger must wait for the ingress and echoServer to be deployed.
        pinger.node.addDependency(ingress, echoServer);
        // this should display the 'hello' text we gave to the server
        new aws_cdk_lib_1.CfnOutput(this, 'IngressPingerResponse', {
            value: pinger.response,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterAlbControllerStack(app, 'aws-cdk-eks-cluster-alb-controller-test');
new integ.IntegTest(app, 'aws-cdk-cluster-alb-controller', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxiLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hbGItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3QywyQ0FBMkM7QUFDM0MsNkNBQThEO0FBQzlELG9EQUFvRDtBQUNwRCwrQkFBK0I7QUFDL0IsdUNBQXVDO0FBQ3ZDLHFGQUEyRTtBQUMzRSw0Q0FBeUM7QUFDekMsMkNBQTJDO0FBRTNDLE1BQU0sNEJBQTZCLFNBQVEsbUJBQUs7SUFFOUMsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLGlEQUFpRDtRQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsR0FBRztZQUNILEdBQUcsd0RBQXVCLENBQUMsSUFBSSxDQUFDO1lBQ2hDLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU07YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDeEQsVUFBVSxFQUFFLENBQUM7b0JBQ1gsS0FBSyxFQUFFLHFCQUFxQjtvQkFDNUIsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztvQkFDeEIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsZUFBZSxFQUFFO3dCQUNmLElBQUksRUFBRSxJQUFJO3FCQUNYO2lCQUNGLENBQUM7U0FDSCxDQUFDO2FBQ0MsZ0JBQWdCLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6Qix3REFBd0Q7UUFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMseUNBQXlDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVwRyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUUvSCxtRkFBbUY7UUFDbkYseUVBQXlFO1FBQ3pFLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUM7UUFFM0QsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkgsNkRBQTZEO1FBQzdELGdDQUFnQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9DLEdBQUcsRUFBRSxVQUFVLG1CQUFtQixFQUFFO1lBQ3BDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztTQUNqQixDQUFDLENBQUM7UUFFSCxzRUFBc0U7UUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRS9DLDZEQUE2RDtRQUM3RCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQzNDLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUTtTQUN2QixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLDRCQUE0QixDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO0FBQy9GLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLEVBQUU7SUFDekQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNkazhzIGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjQnO1xuaW1wb3J0IHsgZ2V0Q2x1c3RlclZlcnNpb25Db25maWcgfSBmcm9tICcuL2ludGVnLXRlc3RzLWt1YmVybmV0ZXMtdmVyc2lvbic7XG5pbXBvcnQgeyBQaW5nZXIgfSBmcm9tICcuL3Bpbmdlci9waW5nZXInO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuXG5jbGFzcyBFa3NDbHVzdGVyQWxiQ29udHJvbGxlclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uZ2V0Q2x1c3RlclZlcnNpb25Db25maWcodGhpcyksXG4gICAgICBhbGJDb250cm9sbGVyOiB7XG4gICAgICAgIHZlcnNpb246IGVrcy5BbGJDb250cm9sbGVyVmVyc2lvbi5WMl80XzEsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hhcnQgPSBuZXcgY2RrOHMuQ2hhcnQobmV3IGNkazhzLkFwcCgpLCAnaGVsbG8tc2VydmVyJyk7XG5cbiAgICBjb25zdCBpbmdyZXNzID0gbmV3IGtwbHVzLkRlcGxveW1lbnQoY2hhcnQsICdEZXBsb3ltZW50Jywge1xuICAgICAgY29udGFpbmVyczogW3tcbiAgICAgICAgaW1hZ2U6ICdoYXNoaWNvcnAvaHR0cC1lY2hvJyxcbiAgICAgICAgYXJnczogWyctdGV4dCcsICdoZWxsbyddLFxuICAgICAgICBwb3J0OiA1Njc4LFxuICAgICAgICBzZWN1cml0eUNvbnRleHQ6IHtcbiAgICAgICAgICB1c2VyOiAxMDA1LFxuICAgICAgICB9LFxuICAgICAgfV0sXG4gICAgfSlcbiAgICAgIC5leHBvc2VWaWFTZXJ2aWNlKHsgc2VydmljZVR5cGU6IGtwbHVzLlNlcnZpY2VUeXBlLk5PREVfUE9SVCB9KVxuICAgICAgLmV4cG9zZVZpYUluZ3Jlc3MoJy8nKTtcblxuICAgIC8vIGFsbG93IHZwYyB0byBhY2Nlc3MgdGhlIEVMQiBzbyBvdXIgcGluZ2VyIGNhbiBoaXQgaXQuXG4gICAgaW5ncmVzcy5tZXRhZGF0YS5hZGRBbm5vdGF0aW9uKCdhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL2luYm91bmQtY2lkcnMnLCBjbHVzdGVyLnZwYy52cGNDaWRyQmxvY2spO1xuXG4gICAgY29uc3QgZWNob1NlcnZlciA9IGNsdXN0ZXIuYWRkQ2RrOHNDaGFydCgnZWNoby1zZXJ2ZXInLCBjaGFydCwgeyBpbmdyZXNzQWxiOiB0cnVlLCBpbmdyZXNzQWxiU2NoZW1lOiBla3MuQWxiU2NoZW1lLklOVEVSTkFMIH0pO1xuXG4gICAgLy8gdGhlIGRlbGV0aW9uIG9mIGBlY2hvU2VydmVyYCBpcyB3aGF0IGluc3RydWN0cyB0aGUgY29udHJvbGxlciB0byBkZWxldGUgdGhlIEVMQi5cbiAgICAvLyBzbyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGhhcHBlbnMgYmVmb3JlIHRoZSBjb250cm9sbGVyIGlzIGRlbGV0ZWQuXG4gICAgZWNob1NlcnZlci5ub2RlLmFkZERlcGVuZGVuY3koY2x1c3Rlci5hbGJDb250cm9sbGVyID8/IFtdKTtcblxuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBjbHVzdGVyLmdldEluZ3Jlc3NMb2FkQmFsYW5jZXJBZGRyZXNzKGluZ3Jlc3MubmFtZSwgeyB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDEwKSB9KTtcblxuICAgIC8vIGNyZWF0ZSBhIHJlc291cmNlIHRoYXQgaGl0cyB0aGUgbG9hZCBiYWxhbmNlciB0byBtYWtlIHN1cmVcbiAgICAvLyBldmVyeXRoaW5nIGlzIHdpcmVkIHByb3Blcmx5LlxuICAgIGNvbnN0IHBpbmdlciA9IG5ldyBQaW5nZXIodGhpcywgJ0luZ3Jlc3NQaW5nZXInLCB7XG4gICAgICB1cmw6IGBodHRwOi8vJHtsb2FkQmFsYW5jZXJBZGRyZXNzfWAsXG4gICAgICB2cGM6IGNsdXN0ZXIudnBjLFxuICAgIH0pO1xuXG4gICAgLy8gdGhlIHBpbmdlciBtdXN0IHdhaXQgZm9yIHRoZSBpbmdyZXNzIGFuZCBlY2hvU2VydmVyIHRvIGJlIGRlcGxveWVkLlxuICAgIHBpbmdlci5ub2RlLmFkZERlcGVuZGVuY3koaW5ncmVzcywgZWNob1NlcnZlcik7XG5cbiAgICAvLyB0aGlzIHNob3VsZCBkaXNwbGF5IHRoZSAnaGVsbG8nIHRleHQgd2UgZ2F2ZSB0byB0aGUgc2VydmVyXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnSW5ncmVzc1BpbmdlclJlc3BvbnNlJywge1xuICAgICAgdmFsdWU6IHBpbmdlci5yZXNwb25zZSxcbiAgICB9KTtcblxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJBbGJDb250cm9sbGVyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1hbGItY29udHJvbGxlci10ZXN0Jyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstY2x1c3Rlci1hbGItY29udHJvbGxlcicsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==