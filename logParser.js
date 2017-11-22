module.exports = function (line) {

  var parsed = {};

  line = line.replace(/"/g, '').trim();

  //
  // ([^ ]*)
  // ([^ ]*)
  // \\[(.*?)\\]
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // \\\"([^ ]*)
  // ([^ ]*)
  // (- |[^ ]*)\\\"
  // (-|[0-9]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // ([^ ]*)
  // (\"[^\"]*\") ([^ ]*)$
  //
  /**
   BucketOwner string,
   Bucket string,
   RequestDateTime string,
   RemoteIP string,
   Requester string,
   RequestID string,
   Operation string,
   Key string,
   RequestURI_operation string,
   RequestURI_key string,
   RequestURI_httpProtoversion string,
   HTTPstatus string,
   ErrorCode string,
   BytesSent string,
   ObjectSize string,
   TotalTime string,
   TurnAroundTime string,
   Referrer string,
   UserAgent string,
   VersionId string
   */

  const mappings = {
    'BucketOwner': /[^ ]* /,
    'Bucket': /[^ ]* /,
    'RequestDateTime': /\[(.*?)] /,
    'RemoteIP': /[^ ]* /,
    'Requester': /[^ ]* /,
    'RequestID': /[^ ]* /,
    'Operation': /[^ ]* /,
    'Key': /[^ ]* /,
    'RequestURI_operation': /[^ ]* /,
    'RequestURI_key': /[^ ]* /,
    'RequestURI_httpProtoversion': /[^ ]* /,
    'HTTPstatus': /[0-9]* /,
    'ErrorCode': /[^ ]* /,
    'BytesSent': /[^ ]* /,
    'ObjectSize': /[^ ]* /,
    'TotalTime': /[^ ]* /,
    'TurnAroundTime': /[^ ]* /,
    'Referrer': /[^ ]* /,
    'UserAgent': /[^ ]* /,
    'VersionId': /[^ ]* /,
  };

  Object.keys(mappings).forEach(key => {
    line = line.replace(mappings[key], (t) => {
      parsed[key] = t.trim();
      return '';
    });
  });

  console.log(line);
  return parsed;
};