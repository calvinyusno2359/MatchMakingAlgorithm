console.log(process.cwd())

let matchMakerEngine = require("../handlers/matchMakerEngine2");

// let matchmaker = new matchMakerEngine.MatchMaker();
let matchmaker = new matchMakerEngine.MatchMaker().verbose(true);

async function test_getAllAvailableAgent() {
  matchmaker = await matchmaker.getAllAvailableAgent();
};

async function test_generateMatch() {
  matchmaker = await matchmaker.getAllAvailableAgent();
  matchmaker = await matchmaker.generateMatch("Back");
};

async function test_matchUser() {
  matchmaker = await matchmaker.getAllAvailableAgent();

  agentId = await matchmaker.matchUser("user1", "Back");
  console.log(agentId)
};

async function test_matchUser_multiple() {
  matchmaker = await matchmaker.getAllAvailableAgent();

  agentId = await matchmaker.matchUser("user1", "Back");
  console.log("signal1:", agentId) // first agent

  agentId = await matchmaker.matchUser("user1", "Back");
  console.log("signal1:", agentId) // first agent (reconnect case)

  agentId = await matchmaker.matchUser("user2", "Back");
  console.log("signal2:", agentId) // second agent

  agentId = await matchmaker.matchUser("user3", "Back");
  console.log("signal3:", agentId) // WAIT (queued, tell wait)

  agentId = await matchmaker.matchUser("user3", "Back");
  console.log("signal3:", agentId) // WAIT (still queueing!)

};

async function test_disconnectUser() {
  await test_matchUser_multiple()

  agentId = await matchmaker.disconnectUser("user1");
  console.log(matchmaker.userTable) // user2 & user3 only

  agentId = await matchmaker.matchUser("user3", "Back");
  console.log("signal3:", agentId) // first agent (topQ now!)
}

async function test_matchUser_empty_tag() {
  matchmaker = await matchmaker.getAllAvailableAgent();

  agentId = await matchmaker.matchUser("user4");
  console.log("signal4:", agentId) // first agent
}

// console.log("\ntest_getAllAvailableAgent")
// test_getAllAvailableAgent();
// console.log("\ntest_generateMatch")
// test_generateMatch();
// console.log("\ntest_matchUser");
// test_matchUser();
// console.log("\ntest_matchUser_multiple");
// test_matchUser_multiple();
console.log("\ntest_disconnectUser");
test_disconnectUser();
console.log("\ntest_matchUser_empty_tag");
test_matchUser_empty_tag();
