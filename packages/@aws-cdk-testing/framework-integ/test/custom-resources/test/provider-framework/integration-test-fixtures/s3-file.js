"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3File = void 0;
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const api = require("./s3-file-handler/api");
const cr = require("aws-cdk-lib/custom-resources");
class S3File extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const resource = new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: S3FileProvider.getOrCreate(this),
            resourceType: 'Custom::S3File',
            properties: {
                [api.PROP_BUCKET_NAME]: props.bucket.bucketName,
                [api.PROP_CONTENTS]: props.contents,
                [api.PROP_OBJECT_KEY]: props.objectKey,
                [api.PROP_PUBLIC]: props.public,
            },
        });
        this.objectKey = resource.getAttString(api.ATTR_OBJECT_KEY);
        this.url = resource.getAttString(api.ATTR_URL);
        this.etag = resource.getAttString(api.ATTR_ETAG);
    }
}
exports.S3File = S3File;
class S3FileProvider extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        this.provider = new cr.Provider(this, 's3file-provider', {
            onEventHandler: new lambda.Function(this, 's3file-on-event', {
                code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
                runtime: lambda.Runtime.NODEJS_14_X,
                handler: 'index.onEvent',
                initialPolicy: [
                    new iam.PolicyStatement({
                        resources: ['*'],
                        actions: [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                            's3:DeleteObject*',
                            's3:PutObject*',
                            's3:Abort*',
                        ],
                    }),
                ],
            }),
        });
    }
    /**
     * Returns the singleton provider.
     */
    static getOrCreate(scope) {
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const id = 'com.amazonaws.cdk.custom-resources.s3file-provider';
        const x = constructs_1.Node.of(stack).tryFindChild(id) || new S3FileProvider(stack, id);
        return x.provider.serviceToken;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInMzLWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyxpREFBaUQ7QUFFakQsNkNBQW9EO0FBQ3BELDJDQUE2QztBQUM3Qyw2Q0FBNkM7QUFDN0MsbURBQW1EO0FBNEJuRCxNQUFhLE1BQU8sU0FBUSxzQkFBUztJQUtuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxRQUFRLEdBQUcsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzlDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsVUFBVSxFQUFFO2dCQUNWLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVO2dCQUMvQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDbkMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVM7Z0JBQ3RDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNGO0FBdkJELHdCQXVCQztBQUVELE1BQU0sY0FBZSxTQUFRLHNCQUFTO0lBY3BDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3ZELGNBQWMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO2dCQUMzRCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDbkMsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLGFBQWEsRUFBRTtvQkFDYixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQzt3QkFDaEIsT0FBTyxFQUFFOzRCQUNQLGVBQWU7NEJBQ2YsZUFBZTs0QkFDZixVQUFVOzRCQUNWLGtCQUFrQjs0QkFDbEIsZUFBZTs0QkFDZixXQUFXO3lCQUNaO3FCQUNGLENBQUM7aUJBQ0g7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQW5DRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBZ0I7UUFDeEMsTUFBTSxLQUFLLEdBQUcsbUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsb0RBQW9ELENBQUM7UUFDaEUsTUFBTSxDQUFDLEdBQUcsaUJBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBbUIsSUFBSSxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0YsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNqQyxDQUFDO0NBNEJGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGFwaSBmcm9tICcuL3MzLWZpbGUtaGFuZGxlci9hcGknO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5cbmludGVyZmFjZSBTM0ZpbGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgYnVja2V0IGluIHdoaWNoIHRoZSBmaWxlIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIG9iamVjdCBrZXkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXV0b21hdGljYWxseS1nZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IG9iamVjdEtleT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudHM6IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoaXMgZmlsZSBzaG91bGQgaGF2ZSBwdWJsaWMtcmVhZCBwZXJtaXNzaW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHB1YmxpYz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBTM0ZpbGUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgb2JqZWN0S2V5OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB1cmw6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGV0YWc6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUzNGaWxlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBTM0ZpbGVQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzKSxcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6UzNGaWxlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgW2FwaS5QUk9QX0JVQ0tFVF9OQU1FXTogcHJvcHMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIFthcGkuUFJPUF9DT05URU5UU106IHByb3BzLmNvbnRlbnRzLFxuICAgICAgICBbYXBpLlBST1BfT0JKRUNUX0tFWV06IHByb3BzLm9iamVjdEtleSxcbiAgICAgICAgW2FwaS5QUk9QX1BVQkxJQ106IHByb3BzLnB1YmxpYyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm9iamVjdEtleSA9IHJlc291cmNlLmdldEF0dFN0cmluZyhhcGkuQVRUUl9PQkpFQ1RfS0VZKTtcbiAgICB0aGlzLnVybCA9IHJlc291cmNlLmdldEF0dFN0cmluZyhhcGkuQVRUUl9VUkwpO1xuICAgIHRoaXMuZXRhZyA9IHJlc291cmNlLmdldEF0dFN0cmluZyhhcGkuQVRUUl9FVEFHKTtcbiAgfVxufVxuXG5jbGFzcyBTM0ZpbGVQcm92aWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNpbmdsZXRvbiBwcm92aWRlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGlkID0gJ2NvbS5hbWF6b25hd3MuY2RrLmN1c3RvbS1yZXNvdXJjZXMuczNmaWxlLXByb3ZpZGVyJztcbiAgICBjb25zdCB4ID0gTm9kZS5vZihzdGFjaykudHJ5RmluZENoaWxkKGlkKSBhcyBTM0ZpbGVQcm92aWRlciB8fCBuZXcgUzNGaWxlUHJvdmlkZXIoc3RhY2ssIGlkKTtcbiAgICByZXR1cm4geC5wcm92aWRlci5zZXJ2aWNlVG9rZW47XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVyOiBjci5Qcm92aWRlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ3MzZmlsZS1wcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdzM2ZpbGUtb24tZXZlbnQnLCB7XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnczMtZmlsZS1oYW5kbGVyJykpLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uRXZlbnQnLFxuICAgICAgICBpbml0aWFsUG9saWN5OiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdConLFxuICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufVxuIl19