let express = require('express');
let bodyParser = express.urlencoded({extended: true});
let RainbowSDK = require("rainbow-node-sdk");
let config = require("./config");
let matchMakerEngine = require("./matchMakerEngine");
let userHandler = require("./handlers/user");
let agentHandler = require("./handlers/agent");
let path = require("path");

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// instantiate matchmaker engine
let matchmaker = new matchMakerEngine.MatchMaker();

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));

// get all contacts and populate agentTable when SDK is ready
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

  // listening to Rainbow events
  // rainbowSDK.events.on('rainbow_onmessagereceived', function(message) {

  //   // test if the message comes from Agent first
  //   if (message.type == "chat" && message.fromJid in matchmaker.agentTable) {
  //     // match agent to user
  //     let userId = matchmaker.matchAgent(message.fromJid);
  //     // forward the message to the user
  //     message = rainbowSDK.im.sendMessageToJid(`${message.content}`, userId);

  //     console.log("agentTable", matchmaker.agentTable);
  //     console.log("userTable", matchmaker.userTable);
  //   }

  //   else if(message.type == "chat") {
  //     // match user to agent
  //     let agentId = matchmaker.matchUser(message.fromJid);
  //     // forward the message to the agent
  //     message = rainbowSDK.im.sendMessageToJid(`${message.content}`, agentId);

  //     console.log("agentTable", matchmaker.agentTable);
  //     console.log("userTable", matchmaker.userTable);

  //   }

  // });


  // listening to web events
  app.get('/', (req, res) => {
    let index = path.join(__dirname + "/views/main.html");
    res.sendFile(index);
  })

  app.post('/sendMessage', (req, res) => {
    let userId = "e6ee304cc6da4184b07d3e594ad84f5e@sandbox-all-in-one-rbx-prod-1.rainbow.sbg"
    let agentId = "5e43c555e9f1273063695767"
    let { message } = req.body;

    conversation = rainbowSDK.conversations.openConversationForContact(agentId);
    message = rainbowSDK.im.sendMessageToJid(`${message}`, agentId);

    console.log(req.body)
    console.log("agentTable", matchmaker.agentTable);
    console.log("userTable", matchmaker.userTable);
  })

  app.listen(config.PORT, () => console.log(`Listening to port: ${config.PORT}...`));

});

