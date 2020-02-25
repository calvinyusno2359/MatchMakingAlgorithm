let RainbowSDK = require("rainbow-node-sdk");

// modules
let config = require("../config");
// instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// setup rainbowSDK
rainbowSDK.events.on('rainbow_onready', (req, res) => {
  // get all contacts and populate agentTable when SDK is ready
  let contacts = rainbowSDK.contacts.getAll();
  // populate contact table
  console.log("Rainbow SDK is ready.")
});

exports.rainbowSDK = rainbowSDK;
