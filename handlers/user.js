let path = require("path");
let RainbowSDK = require("rainbow-node-sdk");

// modules
let rainbow = require("./rainbow");

// get rainbowSDK
let rainbowSDK = rainbow.rainbowSDK;

// get matchmaker
let matchmaker = rainbow.matchmaker;

async function chat(req, res) {
  let view = path.join(__dirname + "/../views/chat.html");
  res.sendFile(view);
};

async function call(req, res) {
  let view = path.join(__dirname + "/../views/call.html");
  res.sendFile(view);
};

async function requesting(req, res) {
  let response = await rainbowSDK.admin.createAnonymousGuestUser(3600);
  let username = response.loginEmail;
  let password = response.password;
  let userId = response.loginEmail.substring(0,24);

  // get the token
  response = await rainbowSDK.admin.askTokenOnBehalf(username, password);
  let token = response.token;

  // match userId with agentId
  console.log(userId);
  let agentId = await matchmaker.matchUser(userId);
  console.log(matchmaker.agentTable);

  res.send({
    "token": token,
    "userId": userId,
    "agent_id": agentId,
  });
};

async function disconnect(req, res) {
  let userId = req.body.userId;

  // disconnect user
  console.log(userId);
  let result = await matchmaker.disconnectUser(userId);
  console.log(matchmaker.agentTable);

  res.send({
    "message": result,
  })
}

// exports
exports.chat = chat;
exports.call = call;
exports.requesting = requesting;
exports.disconnect = disconnect;
