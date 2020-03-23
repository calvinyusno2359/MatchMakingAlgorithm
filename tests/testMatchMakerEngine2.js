console.log(process.cwd())

let matchMakerEngine = require("../handlers/matchMakerEngine2");

// let matchmaker = new matchMakerEngine.MatchMaker();
let matchmaker = new matchMakerEngine.MatchMaker().verbose(true);

async function test_getAllAvailableAgent() {
  matchmaker = await matchmaker.getAllAvailableAgent();
};

console.log("\ntest_getAllAvailableAgent")
test_getAllAvailableAgent();
