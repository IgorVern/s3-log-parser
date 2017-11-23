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

  return logObject;
};