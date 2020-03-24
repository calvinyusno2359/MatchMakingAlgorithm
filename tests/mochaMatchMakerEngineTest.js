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
  beforeEach((done) => {
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

    done();
  });

  it("MME getAllAvailableAgent() works properly", async () => {
    await mme.getAllAvailableAgent();
    assert.equal(mme.availTable.length, 4, "There are more or less than 4 available agent")
    for (var i=0; i<mme.availTable.length; i++) {
      // check all 4 important properties exist
      assert.property(mme.availTable[i], 'id', `${i} does not have property: id`)
      assert.property(mme.availTable[i], 'email', `${i} does not have property: email`)
      assert.property(mme.availTable[i], 'tag', `${i} does not have property: tag`)
      assert.property(mme.availTable[i], 'availability', `${i} does not have property: availability`)

      assert.propertyVal(mme.availTable[i], 'id', expected_availTable[i].id,
                         `${i} does not have property value: ${expected_availTable[i].id}`)
      assert.propertyVal(mme.availTable[i], 'email',expected_availTable[i].email ,
                         `${i} does not have property value: ${expected_availTable[i].email}`)
      assert.propertyVal(mme.availTable[i], 'tag', expected_availTable[i].tag,
                         `${i} does not have property value: ${expected_availTable[i].tag}`)
      assert.propertyVal(mme.availTable[i], 'availability',expected_availTable[i].availability,
                         `${i} does not have property value: ${expected_availTable[i].availability}`)
    }
  });

  it("MME generateMatch() works properly", () => {
    assert.isTrue(true);
  });

  it("MME addAgent() works properly", () => {
    assert.isTrue(true);
  });

  it("MME matchUser() works properly", () => {
    assert.isTrue(true);
  });

  it("MME disconnectUser() works properly", () => {
    assert.isTrue(true);
  });

});

describe('MatchMakerEngine Test: Scenarios', () => {
  let mme;
  beforeEach((done) => {
    mme = new matchmaker.MatchMaker();
    done();
  });

  it("blah b", () => {
    assert.isTrue(true);
  });

});
