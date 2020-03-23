// modules
let mysql = require('mysql');
let dotenv = require('dotenv').config({ path: '../.env' })

let queue = require('./queue');

// somehow the line below causes ENOENT ERROR, hence cannot get config.dblogin => path issue?
// let config = require("../config");

function MatchMaker() {
  console.log("MatchMaker loaded.");

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

  this.matchUser = async function(userId) {
    // matches both agent and user together if user is not matched already, returns agentId
    // done by writing a value to the key in userAgent and agentTable

    return null;
  };

  this.disconnectUser = async function(userId) {
    // disconnects user and agent
    // done by writing null to agentTable and deleting user from userTable

    return null;
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
      this.agentTable[agentId] = null;
      let message = `Success! Agent: ${agentId} has been added to agentTable!`;
      if (this.verbosity) console.log(message);
    }
  };

  this.generateMatch = function(userId) {
    return null;
  };

  this.getAllAvailableAgent = function() {
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
    return this
  };
};

// exports
exports.MatchMaker = MatchMaker;