"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
    const rds = new aws_sdk_1.RDS();
    const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const data = await rds.createDBClusterSnapshot({
            DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        }).promise();
        return {
            PhysicalResourceId: physicalResourceId,
            Data: {
                DBClusterSnapshotArn: data.DBClusterSnapshot?.DBClusterSnapshotArn,
            },
        };
    }
    if (event.RequestType === 'Delete') {
        await rds.deleteDBClusterSnapshot({
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        }).promise();
    }
    return {
        PhysicalResourceId: `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`,
    };
}
exports.onEventHandler = onEventHandler;
async function isCompleteHandler(event) {
    console.log('Event: %j', event);
    const snapshotStatus = await tryGetClusterSnapshotStatus(event.ResourceProperties.DBClusterSnapshotIdentifier);
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return { IsComplete: snapshotStatus === 'available' };
        case 'Delete':
            return { IsComplete: snapshotStatus === undefined };
    }
}
exports.isCompleteHandler = isCompleteHandler;
async function tryGetClusterSnapshotStatus(identifier) {
    try {
        const rds = new aws_sdk_1.RDS();
        const data = await rds.describeDBClusterSnapshots({
            DBClusterSnapshotIdentifier: identifier,
        }).promise();
        return data.DBClusterSnapshots?.[0].Status;
    }
    catch (err) {
        if (err.code === 'DBClusterSnapshotNotFoundFault') {
            return undefined;
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IseUhBQXlIO0FBQ3pILHFDQUE4QixDQUFDLHdEQUF3RDtBQUVoRixLQUFLLFVBQVUsY0FBYyxDQUFDLEtBQStDO0lBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7SUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUU3SCxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ3BFLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLHVCQUF1QixDQUFDO1lBQzdDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUI7WUFDakUsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtTQUNsRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPO1lBQ0wsa0JBQWtCLEVBQUUsa0JBQWtCO1lBQ3RDLElBQUksRUFBRTtnQkFDSixvQkFBb0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CO2FBQ25FO1NBQ0YsQ0FBQztLQUNIO0lBRUQsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUNoQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCO1NBQ2xGLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNkO0lBRUQsT0FBTztRQUNMLGtCQUFrQixFQUFFLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRTtLQUN0SCxDQUFDO0FBQ0osQ0FBQztBQTdCRCx3Q0E2QkM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsS0FBa0Q7SUFDeEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsTUFBTSxjQUFjLEdBQUcsTUFBTSwyQkFBMkIsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUvRyxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFFBQVE7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsS0FBSyxXQUFXLEVBQUUsQ0FBQztRQUN4RCxLQUFLLFFBQVE7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsS0FBSyxTQUFTLEVBQUUsQ0FBQztLQUN2RDtBQUNILENBQUM7QUFaRCw4Q0FZQztBQUVELEtBQUssVUFBVSwyQkFBMkIsQ0FBQyxVQUFrQjtJQUMzRCxJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQztZQUNoRCwyQkFBMkIsRUFBRSxVQUFVO1NBQ3hDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0tBQzVDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7WUFDakQsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzLmQudHNcIiAvPlxuaW1wb3J0IHsgUkRTIH0gZnJvbSAnYXdzLXNkayc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50SGFuZGxlcihldmVudDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVxdWVzdCk6IFByb21pc2U8QVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIGV2ZW50KTtcblxuICBjb25zdCByZHMgPSBuZXcgUkRTKCk7XG5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gYCR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9LSR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9YDtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuY3JlYXRlREJDbHVzdGVyU25hcHNob3Qoe1xuICAgICAgREJDbHVzdGVySWRlbnRpZmllcjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXIsXG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgREJDbHVzdGVyU25hcHNob3RBcm46IGRhdGEuREJDbHVzdGVyU25hcHNob3Q/LkRCQ2x1c3RlclNuYXBzaG90QXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGF3YWl0IHJkcy5kZWxldGVEQkNsdXN0ZXJTbmFwc2hvdCh7XG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGAke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfS0ke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfWAsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlSGFuZGxlcihldmVudDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5Jc0NvbXBsZXRlUmVxdWVzdCk6IFByb21pc2U8QVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5Jc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIGV2ZW50KTtcblxuICBjb25zdCBzbmFwc2hvdFN0YXR1cyA9IGF3YWl0IHRyeUdldENsdXN0ZXJTbmFwc2hvdFN0YXR1cyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyKTtcblxuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogc25hcHNob3RTdGF0dXMgPT09ICdhdmFpbGFibGUnIH07XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHNuYXBzaG90U3RhdHVzID09PSB1bmRlZmluZWQgfTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiB0cnlHZXRDbHVzdGVyU25hcHNob3RTdGF0dXMoaWRlbnRpZmllcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZHMgPSBuZXcgUkRTKCk7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJkcy5kZXNjcmliZURCQ2x1c3RlclNuYXBzaG90cyh7XG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiBkYXRhLkRCQ2x1c3RlclNuYXBzaG90cz8uWzBdLlN0YXR1cztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnREJDbHVzdGVyU25hcHNob3ROb3RGb3VuZEZhdWx0Jykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iXX0=