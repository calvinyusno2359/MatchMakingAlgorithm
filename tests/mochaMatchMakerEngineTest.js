// unit test for Queue object
const assert = require('chai').assert;
const matchmaker = require("../handlers/matchMakerEngine");

describe('MatchMakerEngine Test: Attributes', () => {
  let mme;
  beforeEach((done) => {
    let option = { // Connection strings to test db
      connectionLimit: 10,
      host: "us-cdbr-iron-east-04.cleardb.net",
      user: "bdf43a9616b02c",
      password: "b664b3dc",
      database: "heroku_1b94bebf9d56dd9"
    }
    mme = new matchmaker.MatchMaker().option(option);
    done();
  });

  it("MME must have empty availability table (Array)", () => {
    assert.isArray(mme.availTable, "availTable does not exist");
    assert.isEmpty(mme.availTable, "availTable is not empty");
  });

  it("MME must have empty user table (Object)", () => {
    assert.isObject(mme.userTable, "userTable does not exist");
    assert.isEmpty(mme.userTable, "userTable is not empty");
  });

  it("MME must have empty agent table (Object)", () => {
    assert.isObject(mme.agentTable, "agentTable does not exist");
    assert.isEmpty(mme.agentTable, "agentTable is not empty");
  });

  it("MME must have db connection (Object)", () => {
    assert.isObject(mme.db, "db connection is not established");
  });
});

describe('MatchMakerEngine Test: Methods', () => {
  let mme;
  beforeEach(async function() {
    this.timeout(5000) // timeout for everything beforeEach + function

    let option = {
      connectionLimit: 10,
      host: "us-cdbr-iron-east-04.cleardb.net",
      user: "bdf43a9616b02c",
      password: "b664b3dc",
      database: "heroku_1b94bebf9d56dd9"
    }
    mme = new matchmaker.MatchMaker().option(option);

    // Assumptions for test db:
    // 1. DB content looks like this:
    //    5e422880e9f1273063695253 ; spam.xyz999@gmail.com  ; Back              ; 1
    //    5e43c49ce9f127306369575f ; testa@gmail.com        ; Extremeties,Back  ; 1
    //    5e43c555e9f1273063695767 ; testb@gmail.com        ; Extremeties       ; 1
    //    5e7875a7ae2042244e4317d1 ; testgp@gmail.com       : General Enquiry   ; 1
    // 2. availability = 1 => means this person is  available
    // 3. tags are comma separated and capitalized for first letter

    expected_availTable = [
      {
        id            : '5e422880e9f1273063695253',
        email         : 'spam.xyz999@gmail.com',
        tag           : 'Back',
        availability  : 1
      }, {
        id            : '5e43c49ce9f127306369575f',
        email         : 'testa@gmail.com',
        tag           : 'Extremeties,Back',
        availability  : 1
      }, {
        id            : '5e43c555e9f1273063695767',
        email         : 'testb@gmail.com',
        tag           : 'Extremeties',
        availability  : 1
      }, {
        id            : '5e7875a7ae2042244e4317d1',
        email         : 'testgp@gmail.com',
        tag           : 'General Enquiry',
        availability  : 1
      }
    ];

    mme = await mme.getAllAvailableAgent();
  });

  it("MME getAllAvailableAgent() works properly", async () => {
    await mme.getAllAvailableAgent();
    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent");
    for (var i=0; i<mme.availTable.length; i++) {
      // check all 4 important properties exist
      assert.property(mme.availTable[i], 'id', `${i} does not have property: id`);
      assert.property(mme.availTable[i], 'email', `${i} does not have property: email`);
      assert.property(mme.availTable[i], 'tag', `${i} does not have property: tag`);
      assert.property(mme.availTable[i], 'availability', `${i} does not have property: availability`);

      assert.propertyVal(mme.availTable[i], 'id', expected_availTable[i].id,
                         `${i} does not have property value: ${expected_availTable[i].id}`);
      assert.propertyVal(mme.availTable[i], 'email',expected_availTable[i].email ,
                         `${i} does not have property value: ${expected_availTable[i].email}`);
      assert.propertyVal(mme.availTable[i], 'tag', expected_availTable[i].tag,
                         `${i} does not have property value: ${expected_availTable[i].tag}`);
      assert.propertyVal(mme.availTable[i], 'availability',expected_availTable[i].availability,
                         `${i} does not have property value: ${expected_availTable[i].availability}`);
    }
  }).timeout(1000); // configure how long maximum it should take

  it("MME generateMatch() works properly", async () => {
    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent");
    let tag = "Back";
    let expectedAgent1and2 = expected_availTable[0].id;
    let agent1 = await mme.generateMatch(tag);
    let agent2 = await mme.generateMatch(tag);

    // reasoning: generateMatch does NOT alter agentTable at all, only generates match!
    // that's why doing same request request will result in SAME response!
    assert.equal(agent1, expectedAgent1and2, `${tag} agent 1 generated is wrong`);
    assert.equal(agent2, expectedAgent1and2, `${tag} agent 2 generated is wrong`);
  }).timeout(1500); // configure how long maximum it should take

  it("MME addAgent() works properly", () => {
    let agent1 = "agent1";
    let agent2 = "agent2";
    let isQueue;
    let isEmpty;

    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent");

    mme = mme.addAgent(agent1);
    assert.property(mme.agentTable, 'agent1', `agentTable does not have property: agent1`);

    isQueue = mme.agentTable[agent1];
    assert.isObject(isQueue, 'agent1 Queue is not initialized')

    isEmpty = mme.agentTable[agent1].q;
    assert.isEmpty(isEmpty, 'agent1 Queue is not empty')

    mme = mme.addAgent(agent1);
    let agents = Object.keys(mme.agentTable)
    let count = 0;
    for (var i=0; i<agents.length; i++) if (agents[i] == agent1) count++;
    assert.equal(count, 1, 'there is more or less than 1 agent in agentTable')

    mme = mme.addAgent(agent2);
    assert.property(mme.agentTable, 'agent2', `agentTable does not have property: agent2`);

    isQueue = mme.agentTable[agent2];
    assert.isObject(isQueue, 'agent2 Queue is not initialized')

    isEmpty = mme.agentTable[agent2].q;
    assert.isEmpty(isEmpty, 'agent2 Queue is not empty')

    let sixAgentsTotal = Object.keys(mme.agentTable).length
    assert.equal(sixAgentsTotal, 6, 'there is more or less than 6 agents in agentTable')
  });

  it("MME matchUser() works properly", async () => {
    let tag = "Back";
    let user1 = "user1";
    let user2 = "user2";
    let user3 = "user3";
    let wait = "WAIT"

    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent");

    // there will only be 2 agents to be matched to
    // ideal: least queue + has tag + available
    agent1 = await mme.matchUser(user1, tag);
    assert.equal(agent1, expected_availTable[0].id, "agent matched is not the first ideal agent");

    // already matched, so give back same value (should not take too long)
    stillAgent1 = await mme.matchUser(user1, tag);
    assert.equal(stillAgent1, agent1, "agent returned when alr matched is not the the same");

    // ideal: least queue + has tag + available
    agent2 = await mme.matchUser(user2, tag);
    assert.equal(agent2, expected_availTable[1].id, "agent matched is not the second ideal agent");

    // user3 will be matched to agent1 but given WAIT signal
    agent1Wait = await mme.matchUser(user3, tag);
    assert.equal(agent1Wait, wait, "user3 does not get WAIT signal");
    let agent1Queue = mme.agentTable[agent1].q
    let isUser1 = agent1Queue[0];
    let isUser3 = agent1Queue[1];
    assert.equal(agent1Queue.length, 2, "agent1's queue is more or less than 2")
    assert.equal(isUser1, user1, "agent1's queue current patient is not user1")
    assert.equal(isUser3, user3, "agent1's queue next patient is not user3")

    // user3 asking again will still give WAIT signal but will not be written on agentTable again
    stillAgent1Wait = await mme.matchUser(user3, tag);
    assert.equal(stillAgent1Wait, wait, "agent returned when alr matched is not the the same for user3");
    agent1Queue = mme.agentTable[agent1].q
    isUser1 = agent1Queue[0];
    isUser3 = agent1Queue[1];
    assert.equal(agent1Queue.length, 2, "agent1's queue is more or less than 2")
    assert.equal(isUser1, user1, "agent1's queue current patient is not user1")
    assert.equal(isUser3, user3, "agent1's queue next patient is not user3")
  }).timeout(2500);

  it("MME disconnectUser() works properly", async () => {
    let tag = "Back";
    let user1 = "user1";
    let user2 = "user2";
    let user3 = "user3";
    let user4 = "user4";
    let message;

    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent");

    agent1 = await mme.matchUser(user1, tag);
    agent2 = await mme.matchUser(user2, tag);

    // successful
    expectedMessage = `Success! User: ${user1} has been disconnected from ${agent1}.`;
    message = await mme.disconnectUser(user1);
    assert.equal(message, expectedMessage, "successful disconnection message is incorrect");

    let agent1Queue = mme.agentTable[agent1].q;
    assert.isEmpty(agent1Queue, "agent 1 queue is not empty");

    // is not connected
    expectedMessage = `Failure! User: ${user1} is not currently connected.`;
    message = await mme.disconnectUser(user1);
    assert.equal(message, expectedMessage, "unconnected disconnection message is incorrect");

    // successful
    expectedMessage = `Success! User: ${user2} has been disconnected from ${agent2}.`;
    message = await mme.disconnectUser(user2);
    assert.equal(message, expectedMessage, "successful disconnection message is incorrect");

    let agent2Queue = mme.agentTable[agent2].q;
    assert.isEmpty(agent2Queue, "agent 2 queue is not empty");

  }).timeout(2000);;

});

describe('MatchMakerEngine Test: Scenarios', () => {
  let mme;
  beforeEach((done) => {
    mme = new matchmaker.MatchMaker();
    done();
  });

  it("other edge cases I haven't converted to mocha", () => {
    assert.isTrue(true);
  });

});
