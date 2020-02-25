let path = require("path");
let RainbowSDK = require("rainbow-node-sdk");

// modules
let config = require("../config");

let rainbowSDK = new RainbowSDK(config.options);

async function chat(req, res) {
  let view = path.join(__dirname + "/../views/chat.html");
  res.sendFile(view);
};

async function call(req, res) {
  let view = path.join(__dirname + "/../views/call.html");
  res.sendFile(view);
};

async function requesting(req, res) {
  let agent_id = "5e422880e9f1273063695253";

  let response = await rainbowSDK.admin.createAnonymousGuestUser(3600);
  let username = response.loginEmail;
  let password = response.password;

  // get the token
  response = await rainbowSDK.admin.askTokenOnBehalf(username, password);
  let token = response.token;

  res.send({
    "token": token,
    "agent_id": agent_id,
  });
};

// exports
exports.chat = chat;
exports.call = call;
exports.requesting = requesting;
