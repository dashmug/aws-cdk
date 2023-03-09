"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const s3_assert_1 = require("./integration-test-fixtures/s3-assert");
const s3_file_1 = require("./integration-test-fixtures/s3-file");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const file2Contents = 'this file has a generated physical id';
        const bucket = new s3.Bucket(this, 'MyBucket');
        const file1 = new s3_file_1.S3File(this, 'file1', {
            bucket,
            objectKey: 'second.txt',
            contents: 'Hello, world, 1980!',
        });
        const file2 = new s3_file_1.S3File(this, 'file2', {
            bucket,
            contents: file2Contents,
        });
        new s3_assert_1.S3Assert(this, 'assert-file', {
            bucket,
            objectKey: file2.objectKey,
            expectedContent: file2Contents,
        });
        // delay file2 updates so we can test async assertions
        constructs_1.Node.of(file2).addDependency(file1);
        new aws_cdk_lib_1.CfnOutput(this, 'file1-url', { value: file1.url });
        new aws_cdk_lib_1.CfnOutput(this, 'file2-url', { value: file2.url });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'integ-provider-framework');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFnQjtBQUNoQix5Q0FBeUM7QUFDekMsNkNBQW9EO0FBQ3BELDJDQUE2QztBQUM3QyxxRUFBaUU7QUFDakUsaUVBQTZEO0FBRTdELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsdUNBQXVDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUvQyxNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN0QyxNQUFNO1lBQ04sU0FBUyxFQUFFLFlBQVk7WUFDdkIsUUFBUSxFQUFFLHFCQUFxQjtTQUNoQyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN0QyxNQUFNO1lBQ04sUUFBUSxFQUFFLGFBQWE7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxvQkFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDaEMsTUFBTTtZQUNOLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixlQUFlLEVBQUUsYUFBYTtTQUMvQixDQUFDLENBQUM7UUFFSCxzREFBc0Q7UUFDdEQsaUJBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBRS9DLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnICpcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFMzQXNzZXJ0IH0gZnJvbSAnLi9pbnRlZ3JhdGlvbi10ZXN0LWZpeHR1cmVzL3MzLWFzc2VydCc7XG5pbXBvcnQgeyBTM0ZpbGUgfSBmcm9tICcuL2ludGVncmF0aW9uLXRlc3QtZml4dHVyZXMvczMtZmlsZSc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmaWxlMkNvbnRlbnRzID0gJ3RoaXMgZmlsZSBoYXMgYSBnZW5lcmF0ZWQgcGh5c2ljYWwgaWQnO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ015QnVja2V0Jyk7XG5cbiAgICBjb25zdCBmaWxlMSA9IG5ldyBTM0ZpbGUodGhpcywgJ2ZpbGUxJywge1xuICAgICAgYnVja2V0LFxuICAgICAgb2JqZWN0S2V5OiAnc2Vjb25kLnR4dCcsXG4gICAgICBjb250ZW50czogJ0hlbGxvLCB3b3JsZCwgMTk4MCEnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZTIgPSBuZXcgUzNGaWxlKHRoaXMsICdmaWxlMicsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIGNvbnRlbnRzOiBmaWxlMkNvbnRlbnRzLFxuICAgIH0pO1xuXG4gICAgbmV3IFMzQXNzZXJ0KHRoaXMsICdhc3NlcnQtZmlsZScsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIG9iamVjdEtleTogZmlsZTIub2JqZWN0S2V5LFxuICAgICAgZXhwZWN0ZWRDb250ZW50OiBmaWxlMkNvbnRlbnRzLFxuICAgIH0pO1xuXG4gICAgLy8gZGVsYXkgZmlsZTIgdXBkYXRlcyBzbyB3ZSBjYW4gdGVzdCBhc3luYyBhc3NlcnRpb25zXG4gICAgTm9kZS5vZihmaWxlMikuYWRkRGVwZW5kZW5jeShmaWxlMSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdmaWxlMS11cmwnLCB7IHZhbHVlOiBmaWxlMS51cmwgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnZmlsZTItdXJsJywgeyB2YWx1ZTogZmlsZTIudXJsIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IFRlc3RTdGFjayhhcHAsICdpbnRlZy1wcm92aWRlci1mcmFtZXdvcmsnKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=