let matchMakerEngine = require("../handlers/matchMakerEngine2");

let matchmaker = new matchMakerEngine.MatchMaker();

var message = "";

function test_addAgent() {
  let agent1 = "5e43c49ce9f127306369575f";
  message = matchmaker.addAgent(agent1);
  console.log(message);
  console.log(matchmaker.agentTable);
};

function test_generateMatch() {
  let user1 = "5e43c555e9f1273063695767";
  agentId = matchmaker.generateMatch(user1);
  console.log("agentId:", agentId);
  console.log(matchmaker.agentTable);
}

function test_matchUser() {
  let user1 = "5e43c555e9f1273063695767";
  agentId = matchmaker.matchUser(user1);
  console.log(matchmaker.agentTable);
  console.log(matchmaker.userTable);
  console.log("agentId:", agentId);
}

function test_matchUserBusy() {
  let user1 = "5e43c555e9f1273063695767";
  agentId = matchmaker.matchUser(user1);
  console.log(matchmaker.agentTable);
  console.log(matchmaker.userTable);

  let user2 = "5e43c5asfr012341256gfdb3a";
  agentId = matchmaker.matchUser(user2);
  console.log(matchmaker.agentTable);
  console.log(matchmaker.userTable);
}

function test_disconnectUser() {
  let user1 = "5e43c555e9f1273063695767";
  message = matchmaker.disconnectUser(user1);
  console.log(message);
  console.log(matchmaker.agentTable);
  console.log(matchmaker.userTable);
}

function test_matchAgent() {
  let agent1 = "5e43c49ce9f127306369575f";
  message = matchmaker.matchAgent(agent1);
  console.log(message);
  console.log(matchmaker.agentTable);
}

function test_generateUser() {
  let agent1 = "5e43c49ce9f127306369575f";
  let agent2 = "5e43c555e9f1273063695767";
  let agent3 = "5e43c5asfr012341256gfdb3a";
  let user1 = "user1";
  let user2 = "user2";

  matchmaker.addAgent(agent1);
  matchmaker.addAgent(agent2);
  matchmaker.addAgent(agent3);

  message = matchmaker.matchUser(user1);
  setTimeout(function(){
    console.log(message);
    console.log(matchmaker.agentTable);;
  }, 780);


  message = matchmaker.matchUser(user2);
  setTimeout(function(){
    console.log(message);
    console.log(matchmaker.agentTable);;
  }, 800);
}

// test_addAgent();
// test_addAgent();
// test_generateMatch();
// test_matchUser();
// test_matchUser();
// test_matchAgent();
// test_matchUserBusy();
// test_disconnectUser();
// test_matchAgent();
test_generateUser()

