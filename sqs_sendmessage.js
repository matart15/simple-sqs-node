var uuid = require('uuid');

async function sendSqs({
  sqs,
  queueURL
}) {
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
    QueueUrl: queueURL
  };
  try {
    await sqs.sendMessage(params, function (err, data) 
      console.log("Success", data.MessageId);
  } catch (err) {
    console.log("Error", err);
  }
}

module.exports = { sendSqs }