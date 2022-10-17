// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'ap-northeast-1' });
var credentials = new AWS.SharedIniFileCredentials({ profile: 'integrai-matart-dev' });
AWS.config.credentials = credentials;
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var queueURL = "https://sqs.ap-northeast-1.amazonaws.com/872178091848/integrAI-Camera-dev-Stack1-aiPorcessedQueueEC41E340-CDPGZoOTo5Cl.fifo";

var params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 1
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitMessage() {

  while (true) {
    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        console.log('got Messages: ', data.Messages);
        data.Messages.map(m => {
          var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: m.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, function (err, data) {
            if (err) {
              console.log("Delete Error", err);
            } else {
              console.log("Message Deleted", data);
            }
          });
        })
      }
    });

    await sleep(1000);
    console.log("waiting for message ...")
  }
}
waitMessage();