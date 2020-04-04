// modules
let mysql = require('mysql');
let dotenv = require('dotenv').config({ path: '../.env' })

let queue = require('./queue');

// somehow the line below causes ENOENT ERROR, hence cannot get config.dblogin => path issue?
// let config = require("../config");

function MatchMaker() {
  // console.log("MatchMaker loaded.");

  this.db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.AGENT_DB_HOST,
    user: process.env.AGENT_DB_USERNAME,
    password: process.env.AGENT_DB_PASSWORD,
    database: process.env.AGENT_DB_DATABASE
  });

  this.availTable = [];     // populate all available agent and their info
  this.userTable = {};      // dictionary of {userId: agentId}
  this.agentTable = {};     // dictionary of {agentId: userIdQ}
  this.verbosity = false;

  this.matchUser = async function(userId, tag) {
    // matches both agent and user together if user is not matched already, returns agentId or "WAIT"
    // if user is matched alr, then return either wait signal (if not topQ) or the agentId (if topQ)
    // done by writing a value to the key in userAgent and agentTable

    let matchedAgent = this.userTable[userId];

    if (matchedAgent != null) { // user has been matched
      let message = `This ${userId} has already been matched!`;
      if (this.verbosity) console.log(message);

      // check if userId is topQ or not and respond accordingly
      if (this.agentTable[matchedAgent].peek() == userId) return matchedAgent;
      else return "WAIT";

    } else { // user is new
      let agentId = await this.generateMatch(tag);
      let message = `This ${userId} is matched with ${agentId}!`;

      // write to agentTable and userTable & update db
      this.agentTable[agentId].enqueue(userId);
      this.userTable[userId] = agentId;
      if (this.verbosity) {
        console.log(message);
        console.log(this.agentTable);
        console.log(this.userTable);
      }

      // update db

      // if topQ, returns agentId, else WAIT
      if (this.agentTable[agentId].peek() == userId) return agentId
      else return "WAIT"
    }
  };

  this.disconnectUser = async function(userId) {
    // disconnects user and agent
    // done by writing null to agentTable and deleting user from userTable

    let agentId = this.userTable[userId] || null;
    if (agentId == null) {
      let message = `Failure! User: ${userId} is not currently connected.`
      if (this.verbosity) console.log(message);
      return message;

    } else if (this.agentTable[agentId].peek() == userId) {
      delete this.userTable[userId];
      this.agentTable[agentId].dequeue();

      let message = `Success! User: ${userId} has been disconnected from ${agentId}.`
      if (this.verbosity) console.log(message);
      return message;

    } else {
      let message = `Failure! User: ${userId} is a phantom user, ERROR in matchUser!`
      if (this.verbosity) console.log(message);
      return message;
    }
  };

  this.matchAgent = function(agentId) {
    return null;
  };

  this.addAgent = function(agentId) {
    // adds agent if not inside already
    if (agentId in this.agentTable) {
      let message = `Failure! Agent: ${agentId} was already inside!`;
      if (this.verbosity) console.log(message);
    } else {
      this.agentTable[agentId] = new queue.Queue();
      let message = `Success! Agent: ${agentId} has been added to agentTable!`;
      if (this.verbosity) console.log(message);
    }
    return this
  };

  this.generateMatch = function(tag) {
    // get all agents => populate availTable and agentTable
    return new Promise((resolve, rejcet) => {
      let sql = `SELECT * FROM agent WHERE availability = 1 AND FIND_IN_SET('${tag}', tag)`;
      let agents = this.db.query(sql, (err, agents) => {
        if (err) reject(err);

        // get candidates that is available and has tag
        let candidates = JSON.parse(JSON.stringify(agents));
        let matchedAgent = "5e7875a7ae2042244e4317d1"; // default GP
        let maxQ = 99999;
        let lowestQIndex;

        // check which one has minimum queue => is the matchedAgent
        for (var i=0; i<candidates.length; i++) {
          let q = this.agentTable[candidates[i].id];
          if (q.length() == 0) {
            lowestQIndex = i;
            break;
          } else if (q.length() < maxQ) {
            maxQ = q.length();
            lowestQIndex = i;
            matchedAgent = candidates[i].id;
          } else continue
        }
        matchedAgent = candidates[lowestQIndex].id;

        if (this.verbosity) {
          console.log("candidates:", candidates);
          console.log("matchedAgent:", matchedAgent);
        }

        resolve(matchedAgent);
      });
    });
  };

  this.getAllAvailableAgent = function() {
    // used only for initial startup
    // get all available agent => populate availTable and agentTable
    return new Promise((resolve, rejcet) => {
      let sql = 'SELECT * FROM agent WHERE `availability` = 1 ';
      let agents = this.db.query(sql, (err, agents) => {
        if (err) reject(err);

        // populate availTable
        this.availTable = JSON.parse(JSON.stringify(agents));

        // then register every avail agent to agentTable
        for (var i=0; i<this.availTable.length; i++) this.addAgent(this.availTable[i].id)

        if (this.verbosity) {
          console.log("availTable:", this.availTable);
          console.log("agentTable:", this.agentTable);
        }

        resolve(this);
      });
    })
  };

  this.verbose = function(bool) {
    if (bool === true) this.verbosity = true;
    return this;
  };

  this.option = function(dblogin) {
    this.db = this.db = mysql.createPool(dblogin);
    return this;
  }

  this.search = function(userId) {
		// returns agentId and queueNumber of this userId
		let matchedAgent = this.userTable[userId];
		if (matchedAgent === null) return [null, null];
		else {
			let queue = this.agentTable[matchedAgent];
			let queueNumber = queue.search(userId);
			return [matchedAgent, queueNumber];
		}
  }
};

// exports
exports.MatchMaker = MatchMaker;
