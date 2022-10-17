// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var uuid = require('uuid');
// Set the region 
AWS.config.update({ region: 'ap-northeast-1' });
var credentials = new AWS.SharedIniFileCredentials({ profile: 'integrai-matart-dev' });
AWS.config.credentials = credentials;
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {
  // required for FIFO
  MessageGroupId: "test",
  MessageDeduplicationId: "someId" + uuid.v4(),
  // Remove DelaySeconds parameter and value for FIFO queues
  // DelaySeconds: 10,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "The Whistler"
    },
    "Author": {
      DataType: "String",
      StringValue: "John Grisham"
    },
    "WeeksOn": {
      DataType: "Number",
      StringValue: "6"
    }
  },
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
  // MessageGroupId: "Group1",  // Required for FIFO queues
  QueueUrl: "https://sqs.ap-northeast-1.amazonaws.com/872178091848/integrAI-Camera-dev-Stack1-aiPorcessedQueueEC41E340-CDPGZoOTo5Cl.fifo"
};

sqs.sendMessage(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});