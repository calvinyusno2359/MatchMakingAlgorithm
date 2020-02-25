let RainbowSDK = require("rainbow-node-sdk");

// modules
let config = require("../config");
let matchMakerEngine = require("./matchMakerEngine");

// instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// instantiate matchmaker engine
let matchmaker = new matchMakerEngine.MatchMaker();

// setup rainbowSDK
rainbowSDK.events.on('rainbow_onready', (req, res) => {

  // populate contact table
  // get all contacts and populate agentTable when SDK is ready
  let contacts = rainbowSDK.contacts.getAll();

  // contacts with 'user' as role is
  for (contact of contacts) {
    if (contact.roles.includes("user")) {
      let message = matchmaker.addAgent(contact.id);
      console.log(message);
    }
  }
  console.log(matchmaker.agentTable);

  console.log("Rainbow SDK is ready.");
});

exports.rainbowSDK = rainbowSDK;
exports.matchmaker = matchmaker;
