const readline = require('readline');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();
const parseLine = require('./logParser');

const insertItem = (Item, callback) => {
  dynamodb.putItem({
    TableName: 's3WebLogs',
    Item,
  }, function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

exports.handler = (event, context, callback) => {
  const params = {
    Bucket: 'logs-test-tracking',
    Key: 'track2017-11-15-12-18-42-BA44A933743330FC'
  };

  const fileStream = s3.getObject(params).createReadStream();
  fileStream.on('error', err => callback(err));

  const rl = readline.createInterface({
    input: fileStream
  });

  rl.on('line', (line) => {
    const item = {
      _id: {
        N: `${Date.now()}`
      }
    };
    const logObject = parseLine(line);

    Object.keys(logObject).forEach(key => {
      if (!logObject[key]) {
        item[key] = { NULL: true };
      } else {
        item[key] = { S: logObject[key] };
      }
    });

    insertItem(item);
  });
};
