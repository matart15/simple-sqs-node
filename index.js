require('dotenv').config()
// console.log(process.env)
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const { sendSqs } = require('./sqs_sendmessage.js')
const { waitMessage } = require('./sqs_receivemessage.js')

// Set the region 
AWS.config.update({ region: 'ap-northeast-1' });
var credentials = new AWS.SharedIniFileCredentials({ profile: 'integrai-matart-dev' });
AWS.config.credentials = credentials;
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'ap-northeast-1' });
var credentials = new AWS.SharedIniFileCredentials({ profile: 'integrai-matart-dev' });
AWS.config.credentials = credentials;
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var aiCompletedQueueUrl = "https://sqs.ap-northeast-1.amazonaws.com/872178091848/integrAI-Camera-dev-Stack1-aiPorcessedQueueEC41E340-CDPGZoOTo5Cl.fifo";
var imageUploadQueueUrl = "https://sqs.ap-northeast-1.amazonaws.com/872178091848/integrAI-Camera-dev-Stack1-imageUploadQueue563E88D5-wQ1D1LefaTI3"

waitMessage({
  sqs,
  queueURL: imageUploadQueueUrl,
  onMessageReceived: async (messages) => {
    sendSqs({
      sqs,
      queueURL: aiCompletedQueueUrl
    })
  }
})
