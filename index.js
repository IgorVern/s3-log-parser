const readline = require('readline');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();
const parseLine = require('./logParser');

const insertItem = (Item) => new Promise((resolve, reject) => {
  dynamodb.putItem({
    TableName: 's3WebLogs',
    Item,
  }, function(err, data) {
    if (err) {
      reject({
        error: err,
        message: 'Insert item error',
        item: Item
      });
    } else {
      resolve(data);
    }
  });
});

const processLog = (params) => new Promise((resolve, reject) => {
  const fileStream = s3.getObject(params).createReadStream();
  fileStream.on('error', err => reject({
    error: err,
    params,
    message: 'Get object error'
  }));

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

    insertItem(item).then(resolve).catch(reject);
  });
});

exports.handler = (event, context, callback) => {
  const promises = event.Records.map(record => processLog({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }).catch(err => console.error(JSON.stringify(err)))
  );

  Promise.all(promises).then(() => callback());
};
