let RainbowSDK = require("rainbow-node-sdk");

// modules
let config = require("../config");
let matchMakerEngine = require("./matchMakerEngine");
let admin = require("./admin");

// instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// instantiate matchmaker engine
let matchmaker = new matchMakerEngine.MatchMaker().verbose(true);

// setup rainbowSDK
rainbowSDK.events.on('rainbow_onready', async(req, res) => {

    // populate contact table
    // get all contacts and populate agentTable when SDK is ready
    // let contacts = rainbowSDK.contacts.getAll();
    // contacts with 'user' as role is
    // for (contact of contacts) {
    //   if (contact.roles.includes("user")) {
    //     let message = matchmaker.addAgent(contact.id);
    //     console.log(message);
    //   }
    // }

    await matchmaker.getAllAvailableAgent();
    console.log(matchmaker.agentTable);

    console.log("Rainbow SDK is ready.");
});

rainbowSDK.events.on("rainbow_oncontactpresencechanged", async(contact) => {
    // update db when availability changes for this contact
    let agentId = contact.id;
    let status;
    if (contact.presence === "online") {
        status = await admin.updateAgentAvailability(agentId, "1");
        if (status) matchmaker.getAllAvailableAgent();
    } else {
        status = await admin.updateAgentAvailability(agentId, "0");
        if (status) {
            matchmaker.removeAgent(agentId);
            await matchmaker.getAllAvailableAgent();
        }
    }
});

exports.rainbowSDK = rainbowSDK;
exports.matchmaker = matchmaker;