// unit test for Queue object
const assert = require('chai').assert;
const matchmaker = require("../handlers/matchMakerEngine");

describe('MatchMakerEngine Test: Attributes', () => {
  let mme;
  beforeEach((done) => {
    mme = new queue.MatchMaker();
    done();
  });

  it("Queue must have empty array", () => {
    assert.isTrue(Array.isArray(q.q), "Queue does not have array");
    assert.equal(q.q.length, 0, "Queue array length is not 0");
  });
});

describe('MatchMakerEngine Test: Methods', () => {
  let mme;
  beforeEach((done) => {
    mme = new queue.MatchMaker();
    done();
  });

  it("blah b", () => {
    assert.isTrue(true);
  });

});

describe('MatchMakerEngine Test: Scenarios', () => {
  let mme;
  beforeEach((done) => {
    mme = new queue.MatchMaker();
    done();
  });

  it("blah b", () => {
    assert.isTrue(true);
  });

});
