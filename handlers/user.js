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

  // get the token
  response = await rainbowSDK.admin.askTokenOnBehalf(username, password);
  let token = response.token;

  // match user with agent
  console.log(password);
  let agent_id = matchmaker.matchUser(password);
  console.log(matchmaker.agentTable);

  res.send({
    "token": token,
    "agent_id": agent_id,
  });
};

// exports
exports.chat = chat;
exports.call = call;
exports.requesting = requesting;
