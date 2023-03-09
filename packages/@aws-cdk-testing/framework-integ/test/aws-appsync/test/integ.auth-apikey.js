"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appsync_1 = require("aws-cdk-lib/aws-appsync");
/*
 * Creates an Appsync GraphQL API with API_KEY authorization.
 * Testing for API_KEY Authorization.
 *
 * Stack verification steps:
 * Deploy stack, get api-key and endpoint.
 * Check if authorization occurs with empty get.
 *
 * -- bash verify.integ.auth-apikey.sh --start                      -- deploy stack               --
 * -- aws appsync list-graphql-apis                                 -- obtain api id && endpoint  --
 * -- aws appsync list-api-keys --api-id [API ID]                   -- obtain api key             --
 * -- bash verify.integ.auth-apikey.sh --check [APIKEY] [ENDPOINT]  -- check if fails/success     --
 * -- bash verify.integ.auth-apikey.sh --clean                      -- clean dependencies/stack   --
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-appsync-integ');
const api = new aws_appsync_1.GraphqlApi(stack, 'Api', {
    name: 'Integ_Test_APIKey',
    schema: aws_appsync_1.SchemaFile.fromAsset(path_1.join(__dirname, 'appsync.auth.graphql')),
    authorizationConfig: {
        defaultAuthorization: {
            authorizationType: aws_appsync_1.AuthorizationType.API_KEY,
            apiKeyConfig: {
                // Rely on default expiration date provided by the API so we have a deterministic snapshot
                expires: undefined,
            },
        },
    },
});
const testTable = new aws_dynamodb_1.Table(stack, 'TestTable', {
    billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
        name: 'id',
        type: aws_dynamodb_1.AttributeType.STRING,
    },
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const testDS = api.addDynamoDbDataSource('testDataSource', testTable);
testDS.createResolver('QueryGetTests', {
    typeName: 'Query',
    fieldName: 'getTests',
    requestMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbScanTable(),
    responseMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbResultList(),
});
testDS.createResolver('MutationAddTest', {
    typeName: 'Mutation',
    fieldName: 'addTest',
    requestMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbPutItem(aws_appsync_1.PrimaryKey.partition('id').auto(), aws_appsync_1.Values.projecting('test')),
    responseMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbResultItem(),
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXV0aC1hcGlrZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hdXRoLWFwaWtleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE0QjtBQUM1QiwyREFBNkU7QUFDN0UsNkNBQXdEO0FBQ3hELHlEQUF5SDtBQUV6SDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBRWxELE1BQU0sR0FBRyxHQUFHLElBQUksd0JBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ3ZDLElBQUksRUFBRSxtQkFBbUI7SUFDekIsTUFBTSxFQUFFLHdCQUFVLENBQUMsU0FBUyxDQUFDLFdBQUksQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztJQUNyRSxtQkFBbUIsRUFBRTtRQUNuQixvQkFBb0IsRUFBRTtZQUNwQixpQkFBaUIsRUFBRSwrQkFBaUIsQ0FBQyxPQUFPO1lBQzVDLFlBQVksRUFBRTtnQkFDWiwwRkFBMEY7Z0JBQzFGLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sU0FBUyxHQUFHLElBQUksb0JBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQzlDLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7SUFDeEMsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO0tBQzNCO0lBQ0QsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFdEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUU7SUFDckMsUUFBUSxFQUFFLE9BQU87SUFDakIsU0FBUyxFQUFFLFVBQVU7SUFDckIsc0JBQXNCLEVBQUUsNkJBQWUsQ0FBQyxpQkFBaUIsRUFBRTtJQUMzRCx1QkFBdUIsRUFBRSw2QkFBZSxDQUFDLGtCQUFrQixFQUFFO0NBQzlELENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUU7SUFDdkMsUUFBUSxFQUFFLFVBQVU7SUFDcEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsc0JBQXNCLEVBQUUsNkJBQWUsQ0FBQyxlQUFlLENBQUMsd0JBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsb0JBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckgsdUJBQXVCLEVBQUUsNkJBQWUsQ0FBQyxrQkFBa0IsRUFBRTtDQUM5RCxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBCaWxsaW5nTW9kZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEF1dGhvcml6YXRpb25UeXBlLCBHcmFwaHFsQXBpLCBNYXBwaW5nVGVtcGxhdGUsIFByaW1hcnlLZXksIFNjaGVtYUZpbGUsIFZhbHVlcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcHBzeW5jJztcblxuLypcbiAqIENyZWF0ZXMgYW4gQXBwc3luYyBHcmFwaFFMIEFQSSB3aXRoIEFQSV9LRVkgYXV0aG9yaXphdGlvbi5cbiAqIFRlc3RpbmcgZm9yIEFQSV9LRVkgQXV0aG9yaXphdGlvbi5cbiAqXG4gKiBTdGFjayB2ZXJpZmljYXRpb24gc3RlcHM6XG4gKiBEZXBsb3kgc3RhY2ssIGdldCBhcGkta2V5IGFuZCBlbmRwb2ludC5cbiAqIENoZWNrIGlmIGF1dGhvcml6YXRpb24gb2NjdXJzIHdpdGggZW1wdHkgZ2V0LlxuICpcbiAqIC0tIGJhc2ggdmVyaWZ5LmludGVnLmF1dGgtYXBpa2V5LnNoIC0tc3RhcnQgICAgICAgICAgICAgICAgICAgICAgLS0gZGVwbG95IHN0YWNrICAgICAgICAgICAgICAgLS1cbiAqIC0tIGF3cyBhcHBzeW5jIGxpc3QtZ3JhcGhxbC1hcGlzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gb2J0YWluIGFwaSBpZCAmJiBlbmRwb2ludCAgLS1cbiAqIC0tIGF3cyBhcHBzeW5jIGxpc3QtYXBpLWtleXMgLS1hcGktaWQgW0FQSSBJRF0gICAgICAgICAgICAgICAgICAgLS0gb2J0YWluIGFwaSBrZXkgICAgICAgICAgICAgLS1cbiAqIC0tIGJhc2ggdmVyaWZ5LmludGVnLmF1dGgtYXBpa2V5LnNoIC0tY2hlY2sgW0FQSUtFWV0gW0VORFBPSU5UXSAgLS0gY2hlY2sgaWYgZmFpbHMvc3VjY2VzcyAgICAgLS1cbiAqIC0tIGJhc2ggdmVyaWZ5LmludGVnLmF1dGgtYXBpa2V5LnNoIC0tY2xlYW4gICAgICAgICAgICAgICAgICAgICAgLS0gY2xlYW4gZGVwZW5kZW5jaWVzL3N0YWNrICAgLS1cbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtYXBwc3luYy1pbnRlZycpO1xuXG5jb25zdCBhcGkgPSBuZXcgR3JhcGhxbEFwaShzdGFjaywgJ0FwaScsIHtcbiAgbmFtZTogJ0ludGVnX1Rlc3RfQVBJS2V5JyxcbiAgc2NoZW1hOiBTY2hlbWFGaWxlLmZyb21Bc3NldChqb2luKF9fZGlybmFtZSwgJ2FwcHN5bmMuYXV0aC5ncmFwaHFsJykpLFxuICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgIC8vIFJlbHkgb24gZGVmYXVsdCBleHBpcmF0aW9uIGRhdGUgcHJvdmlkZWQgYnkgdGhlIEFQSSBzbyB3ZSBoYXZlIGEgZGV0ZXJtaW5pc3RpYyBzbmFwc2hvdFxuICAgICAgICBleHBpcmVzOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuY29uc3QgdGVzdFRhYmxlID0gbmV3IFRhYmxlKHN0YWNrLCAnVGVzdFRhYmxlJywge1xuICBiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICBwYXJ0aXRpb25LZXk6IHtcbiAgICBuYW1lOiAnaWQnLFxuICAgIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICB9LFxuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxuY29uc3QgdGVzdERTID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZSgndGVzdERhdGFTb3VyY2UnLCB0ZXN0VGFibGUpO1xuXG50ZXN0RFMuY3JlYXRlUmVzb2x2ZXIoJ1F1ZXJ5R2V0VGVzdHMnLCB7XG4gIHR5cGVOYW1lOiAnUXVlcnknLFxuICBmaWVsZE5hbWU6ICdnZXRUZXN0cycsXG4gIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlNjYW5UYWJsZSgpLFxuICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0TGlzdCgpLFxufSk7XG5cbnRlc3REUy5jcmVhdGVSZXNvbHZlcignTXV0YXRpb25BZGRUZXN0Jywge1xuICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgZmllbGROYW1lOiAnYWRkVGVzdCcsXG4gIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlB1dEl0ZW0oUHJpbWFyeUtleS5wYXJ0aXRpb24oJ2lkJykuYXV0bygpLCBWYWx1ZXMucHJvamVjdGluZygndGVzdCcpKSxcbiAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==