// const readline = require('readline');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
// const dynamodb = new AWS.DynamoDB();
//
// const insertItem = (Item, callback) => {
//   dynamodb.putItem({
//     TableName: 's3WebLogs',
//     Item,
//   }, function(err, data) {
//     if (err) {
//       callback(err);
//     } else {
//       callback();
//     }
//   });
// };
//
// exports.handler = (event, context, callback) => {
//   const params = {
//     Bucket: 'logs-test-tracking',
//     Key: 'track2017-11-15-12-18-42-BA44A933743330FC'
//   };
//
//   const fileStream = s3.getObject(params).createReadStream();
//   fileStream.on('error', err => callback(err));
//
//   const rl = readline.createInterface({
//     input: fileStream
//   });
//
//   rl.on('line', (line) => insertItem({
//     _id: {
//       N: `${Date.now()}`
//     },
//     line: {
//       S: line
//     }
//   }, callback));
// };
const parseLine = require('./logParser');

const line = '6e5d0e931f750e3ff2aa4452f4dedbde8cfdabf55952b8326f691d0cae2245b7 track-access [15/Nov/2017:11:11:49 +0000] 5.18.241.205 6e5d0e931f750e3ff2aa4452f4dedbde8cfdabf55952b8326f691d0cae2245b7 E85AE18FF53EBABE REST.GET.WEBSITE - "GET /track-access?website= HTTP/1.1" 404 NoSuchWebsiteConfiguration 339 - 8 - "-" "S3Console/0.4, aws-internal/3" -';

console.log(parseLine(line));
