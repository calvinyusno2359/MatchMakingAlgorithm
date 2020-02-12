// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");
let config = require("./config")

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);



rainbowSDK.start().then(() => {
  // echo message
  rainbowSDK.events.on('rainbow_onmessagereceived', function(message) {
    // Do something when the SDK is started
    console.log("start");

    // test if the message comes from a bubble of from a conversation with one participant
    if(message.type == "groupchat") {
        // Send the answer to the bubble
        messageSent = rainbowSDK.im.sendMessageToBubbleJid('The message answer', message.fromBubbleJid);
        console.log("bubble rainbow_onmessagereceived")
    }

    else {
        // send the answer to the user directly otherwise
        messageSent = rainbowSDK.im.sendMessageToJid('The message answer', message.fromJid);
        console.log("rainbow_onmessagereceived")
        console.log(message)
    }

  });

});


