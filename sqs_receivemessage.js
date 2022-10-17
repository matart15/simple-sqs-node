
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitMessage({
  sqs,
  queueURL,
  onMessageReceived
}) {
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

        onMessageReceived({
          messages: data.Messages
        })
      }
    });

    await sleep(1000);
    // console.log("waiting for message ...")
  }
}

module.exports = { waitMessage }