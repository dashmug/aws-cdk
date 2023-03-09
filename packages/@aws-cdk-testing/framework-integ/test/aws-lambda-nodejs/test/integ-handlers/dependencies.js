"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* eslint-disable no-console */
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const delay_1 = require("delay");
const s3 = new aws_sdk_1.S3();
async function handler() {
    console.log(s3);
    await delay_1.default(5);
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixxQ0FBNkIsQ0FBQyx3REFBd0Q7QUFDdEYsaUNBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLE1BQU0sZUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUM7QUFIRCwwQkFHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IFMzIH0gZnJvbSAnYXdzLXNkayc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgZGVsYXkgZnJvbSAnZGVsYXknO1xuXG5jb25zdCBzMyA9IG5ldyBTMygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgY29uc29sZS5sb2coczMpO1xuICBhd2FpdCBkZWxheSg1KTtcbn1cbiJdfQ==