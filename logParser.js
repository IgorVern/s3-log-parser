const moment = require('moment');

const parseLine = (lineToParse) => {
  const parsedLine = {};
  const mappings = {
    'bucketOwner': /[^ ]* /,
    'bucket': /[^ ]* /,
    'requestDateTime': /\[(.*?)] /,
    'remoteIp': /[^ ]* /,
    'requester': /[^ ]* /,
    'requestId': /[^ ]* /,
    'operation': /[^ ]* /,
    'key': /[^ ]* /,
    'httpString': /"[^"]*" /,
    'httpStatus': /[0-9]* /,
    'errorCode': /[^ ]* /,
    'bytesSent': /[^ ]* /,
    'objectSize': /[^ ]* /,
    'totalTime': /[^ ]* /,
    'turnAroundTime': /[^ ]* /,
    'referrer': /"[^"]" /,
    'userAgent': /".+" /,
    'versionId': /[^ ]*/,
  };

  let line = lineToParse.replace(/\n/g, '');

  Object.keys(mappings).forEach(key => {
    line = line.replace(mappings[key], (t) => {
      parsedLine[key] = t.replace(/"/g, '').trim();
      return '';
    });
  });

  return parsedLine;
};

const parseHttpString = (httpString) => httpString.match(/[^ ]*/g).filter(item => item);

const timestampToISOString = (timestamp) => {
  const datetime = timestamp.replace(/\[|\]/g, '');

  return moment(datetime , 'DD/MMM/YYYY:HH:mm:ss Z').utc().format();
};

module.exports = (lineToParse) => {
  const logObject = parseLine(lineToParse);
  const parsedString = parseHttpString(logObject.httpString);

  const httpStringMappings = [
    'requestHttpMethod',
    'requestUri',
    'requestHttpProtocolVersion',
  ];

  httpStringMappings.forEach((key, i) => {
    logObject[key] = parsedString[i];
  });

  delete logObject.httpString;

  logObject.requestDateTime = timestampToISOString(logObject.requestDateTime);

  Object.keys(logObject).forEach(key => {
     if (logObject[key] === '-') {
       logObject[key] = null;
     }
  });

  return logObject;
};