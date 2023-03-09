"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Assert = void 0;
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const cr = require("aws-cdk-lib/custom-resources");
/**
 * A custom resource that asserts that a file on s3 has the specified contents.
 * This resource will wait 10 minutes before, allowing for eventual consistency
 * to stabilize (and also exercises the idea of asynchronous custom resources).
 *
 * Code is written in Python because why not.
 */
class S3Assert extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: S3AssertProvider.getOrCreate(this),
            resourceType: 'Custom::S3Assert',
            properties: {
                BucketName: props.bucket.bucketName,
                ObjectKey: props.objectKey,
                ExpectedContent: props.expectedContent,
            },
        });
    }
}
exports.S3Assert = S3Assert;
class S3AssertProvider extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        const onEvent = new lambda.Function(this, 's3assert-on-event', {
            code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.on_event',
        });
        const isComplete = new lambda.Function(this, 's3assert-is-complete', {
            code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.is_complete',
            initialPolicy: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: [
                        's3:GetObject*',
                        's3:GetBucket*',
                        's3:List*',
                    ],
                }),
            ],
        });
        this.provider = new cr.Provider(this, 's3assert-provider', {
            onEventHandler: onEvent,
            isCompleteHandler: isComplete,
            totalTimeout: aws_cdk_lib_1.Duration.minutes(5),
        });
    }
    /**
     * Returns the singleton provider.
     */
    static getOrCreate(scope) {
        const providerId = 'com.amazonaws.cdk.custom-resources.s3assert-provider';
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const group = constructs_1.Node.of(stack).tryFindChild(providerId) || new S3AssertProvider(stack, providerId);
        return group.provider.serviceToken;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtYXNzZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtYXNzZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsaURBQWlEO0FBRWpELDZDQUE4RDtBQUM5RCwyQ0FBNkM7QUFDN0MsbURBQW1EO0FBbUJuRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxzQkFBUztJQUVyQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDaEQsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDbkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMxQixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7YUFDdkM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFmRCw0QkFlQztBQUVELE1BQU0sZ0JBQWlCLFNBQVEsc0JBQVM7SUFjdEMsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzdELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLGdCQUFnQjtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQ25FLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDbEMsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixhQUFhLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO29CQUN0QixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2hCLE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsVUFBVTtxQkFDWDtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDekQsY0FBYyxFQUFFLE9BQU87WUFDdkIsaUJBQWlCLEVBQUUsVUFBVTtZQUM3QixZQUFZLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztJQUNMLENBQUM7SUExQ0Q7O09BRUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCO1FBQ3hDLE1BQU0sVUFBVSxHQUFHLHNEQUFzRCxDQUFDO1FBQzFFLE1BQU0sS0FBSyxHQUFHLG1CQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFHLGlCQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQXFCLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckgsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztJQUNyQyxDQUFDO0NBbUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBTM0Fzc2VydFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzMyBidWNrZXQgdG8gcXVlcnkuXG4gICAqL1xuICByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3Qga2V5LlxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0S2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBleHBlY3RlZCBjb250ZW50cy5cbiAgICovXG4gIHJlYWRvbmx5IGV4cGVjdGVkQ29udGVudDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY3VzdG9tIHJlc291cmNlIHRoYXQgYXNzZXJ0cyB0aGF0IGEgZmlsZSBvbiBzMyBoYXMgdGhlIHNwZWNpZmllZCBjb250ZW50cy5cbiAqIFRoaXMgcmVzb3VyY2Ugd2lsbCB3YWl0IDEwIG1pbnV0ZXMgYmVmb3JlLCBhbGxvd2luZyBmb3IgZXZlbnR1YWwgY29uc2lzdGVuY3lcbiAqIHRvIHN0YWJpbGl6ZSAoYW5kIGFsc28gZXhlcmNpc2VzIHRoZSBpZGVhIG9mIGFzeW5jaHJvbm91cyBjdXN0b20gcmVzb3VyY2VzKS5cbiAqXG4gKiBDb2RlIGlzIHdyaXR0ZW4gaW4gUHl0aG9uIGJlY2F1c2Ugd2h5IG5vdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFMzQXNzZXJ0IGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUzNBc3NlcnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBTM0Fzc2VydFByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMpLFxuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpTM0Fzc2VydCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEJ1Y2tldE5hbWU6IHByb3BzLmJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgICBPYmplY3RLZXk6IHByb3BzLm9iamVjdEtleSxcbiAgICAgICAgRXhwZWN0ZWRDb250ZW50OiBwcm9wcy5leHBlY3RlZENvbnRlbnQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFMzQXNzZXJ0UHJvdmlkZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaW5nbGV0b24gcHJvdmlkZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBjb25zdCBwcm92aWRlcklkID0gJ2NvbS5hbWF6b25hd3MuY2RrLmN1c3RvbS1yZXNvdXJjZXMuczNhc3NlcnQtcHJvdmlkZXInO1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGdyb3VwID0gTm9kZS5vZihzdGFjaykudHJ5RmluZENoaWxkKHByb3ZpZGVySWQpIGFzIFMzQXNzZXJ0UHJvdmlkZXIgfHwgbmV3IFMzQXNzZXJ0UHJvdmlkZXIoc3RhY2ssIHByb3ZpZGVySWQpO1xuICAgIHJldHVybiBncm91cC5wcm92aWRlci5zZXJ2aWNlVG9rZW47XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IHByb3ZpZGVyOiBjci5Qcm92aWRlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IG9uRXZlbnQgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdzM2Fzc2VydC1vbi1ldmVudCcsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnczMtYXNzZXJ0LWhhbmRsZXInKSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uX2V2ZW50JyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGlzQ29tcGxldGUgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdzM2Fzc2VydC1pcy1jb21wbGV0ZScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnczMtYXNzZXJ0LWhhbmRsZXInKSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmlzX2NvbXBsZXRlJyxcbiAgICAgIGluaXRpYWxQb2xpY3k6IFtcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdzM2Fzc2VydC1wcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBvbkV2ZW50LFxuICAgICAgaXNDb21wbGV0ZUhhbmRsZXI6IGlzQ29tcGxldGUsXG4gICAgICB0b3RhbFRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==