// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");
let config = require("./config");
let matchMakerEngine = require("./matchmakerEngine");

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

//  get all contacts
rainbowSDK.events.on('rainbow_onready', function() {
    let contacts = rainbowSDK.contacts.getAll();
});

// starts rainbowsdk
rainbowSDK.start().then(() => {
  console.log(">> RainbowSDK started.");

  // instantiate matchmaker engine
  let matchmaker = new matchMakerEngine.MatchMaker();

  rainbowSDK.events.on('rainbow_onmessagereceived', function(message) {

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


