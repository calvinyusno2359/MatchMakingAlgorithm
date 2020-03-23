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
  matchmaker = await matchmaker.matchUser("user1", "Back");
};

// console.log("\ntest_getAllAvailableAgent")
// test_getAllAvailableAgent();
console.log("\ntest_generateMatch")
test_generateMatch();
console.log("\ntest_matchUser");
test_matchUser();
