"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const kms = require("aws-cdk-lib/aws-kms");
const cdk = require("aws-cdk-lib");
const aws_docdb_1 = require("aws-cdk-lib/aws-docdb");
/*
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });
        const params = new aws_docdb_1.ClusterParameterGroup(this, 'Params', {
            family: 'docdb3.6',
            description: 'A nice parameter group',
            parameters: {
                audit_logs: 'disabled',
                tls: 'enabled',
                ttl_monitor: 'enabled',
            },
        });
        const kmsKey = new kms.Key(this, 'DbSecurity', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const cluster = new aws_docdb_1.DatabaseCluster(this, 'Database', {
            engineVersion: '3.6.0',
            masterUser: {
                username: 'docdb',
                password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
            },
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            vpc,
            parameterGroup: params,
            kmsKey,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-docdb-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUVuQyxxREFBK0U7QUFFL0U7OztHQUdHO0FBRUgsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUEyQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELE1BQU0sTUFBTSxHQUFHLElBQUksaUNBQXFCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN2RCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsV0FBVyxFQUFFLFNBQVM7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM3QyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksMkJBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGFBQWEsRUFBRSxPQUFPO1lBQ3RCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtDQUFrQyxDQUFDO2FBQzlFO1lBQ0QsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQy9FLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxHQUFHO1lBQ0gsY0FBYyxFQUFFLE1BQU07WUFDdEIsTUFBTTtZQUNOLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBRTFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRGF0YWJhc2VDbHVzdGVyLCBDbHVzdGVyUGFyYW1ldGVyR3JvdXAgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZG9jZGInO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBhd3MgZG9jZGIgZGVzY3JpYmUtZGItY2x1c3RlcnMgLS1kYi1jbHVzdGVyLWlkZW50aWZpZXIgPGRlcGxveWVkIGRiIGNsdXN0ZXIgaWRlbnRpZmllcj5cbiAqL1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMnLCB7IG1heEF6czogMiB9KTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBDbHVzdGVyUGFyYW1ldGVyR3JvdXAodGhpcywgJ1BhcmFtcycsIHtcbiAgICAgIGZhbWlseTogJ2RvY2RiMy42JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBuaWNlIHBhcmFtZXRlciBncm91cCcsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGF1ZGl0X2xvZ3M6ICdkaXNhYmxlZCcsXG4gICAgICAgIHRsczogJ2VuYWJsZWQnLFxuICAgICAgICB0dGxfbW9uaXRvcjogJ2VuYWJsZWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGttc0tleSA9IG5ldyBrbXMuS2V5KHRoaXMsICdEYlNlY3VyaXR5Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgRGF0YWJhc2VDbHVzdGVyKHRoaXMsICdEYXRhYmFzZScsIHtcbiAgICAgIGVuZ2luZVZlcnNpb246ICczLjYuMCcsXG4gICAgICBtYXN0ZXJVc2VyOiB7XG4gICAgICAgIHVzZXJuYW1lOiAnZG9jZGInLFxuICAgICAgICBwYXNzd29yZDogY2RrLlNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnNzk1OTg2NmNhY2MwMmMyZDI0M2VjZmUxNzc0NjRmZTYnKSxcbiAgICAgIH0sXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuUjUsIGVjMi5JbnN0YW5jZVNpemUuTEFSR0UpLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIHZwYyxcbiAgICAgIHBhcmFtZXRlckdyb3VwOiBwYXJhbXMsXG4gICAgICBrbXNLZXksXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoJ09wZW4gdG8gdGhlIHdvcmxkJyk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWRvY2RiLWludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19