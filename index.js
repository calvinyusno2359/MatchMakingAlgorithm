// Load the SDK
let RainbowSDK = require("rainbow-node-sdk");
let config = require("./config");
let matchMakerEngine = require("./matchMakerEngine");

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// instantiate matchmaker engine
let matchmaker = new matchMakerEngine.MatchMaker();

// get all contacts and populate agentTable
rainbowSDK.events.on('rainbow_onready', function() {
  let contacts = rainbowSDK.contacts.getAll();
  for (contact of contacts) {

    // selects only agents
    if (contact.name.value == "Test A") { // isAgent
      matchmaker.addAgent(contact.jid_im);
      console.log("agentTable", matchmaker.agentTable);
    }

    else {continue;}
  }
});

// starts rainbowsdk
rainbowSDK.start().then(() => {
  console.log(">> RainbowSDK started.");

  rainbowSDK.events.on('rainbow_onmessagereceived', function(message) {

    // test if the message comes from a bubble of from a conversation with one participant
    if(message.type == "chat") {

      // match user to agent
      let agentId = matchmaker.matchUser(message.fromJid);

      // forward the message to the agent
      message = rainbowSDK.im.sendMessageToJid(`${message.content}`, agentId);

    }

  });

});


