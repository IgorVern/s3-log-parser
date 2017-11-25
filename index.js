const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const s3 = new AWS.S3();
const readline = require('readline');
const Rx = require('rxjs');
const uuid = require('uuid');

const parseLine = require('./logParser');

const config = {
	dynamoDB: {
		tableName: 's3WebLogs'
	}
};

const logError = (err) => console.error(JSON.stringify(err));

const getLines = (params) => Rx.Observable.create((observer) => {
	const fileStream = s3.getObject(params).createReadStream();

	fileStream.on('error', (err) => {
		logError({
			error: err,
			params,
			message: 'Get object error'
		});
	});

	const rl = readline.createInterface({
		input: fileStream
	});


	rl.on('line', (line) => {
		observer.next(line);
	});
});

const getDynamoItem = (logObject) => {
	const item = {
		_id: {
			S: uuid.v4()
		}
	};


	Object.keys(logObject).forEach(key => {
		if (!logObject[key]) {
			item[key] = {NULL: true};
		} else {
			item[key] = {S: logObject[key]};
		}
	});

	return item;
};

const prepareData = (Item) => ({
	TableName: config.dynamoDB.tableName,
	Item,
});

const insertItem = Rx.Observable.bindNodeCallback(dynamodb.putItem);

exports.handler = (event, context, callback) => {
	Rx.Observable.from(event.Records)
		.map((record) => ({
			Bucket: record.s3.bucket.name,
			Key: record.s3.object.key
		}))
		.map(getLines)
		.mergeAll()
		.map(parseLine)
		.map(getDynamoItem)
		.map(prepareData)
		.map(insertItem)
		.mergeAll()
		.subscribe({
			next: data => console.log('Item is inserted'),
			error: err => callback(err),
			complete: item => callback(),
		});
};
