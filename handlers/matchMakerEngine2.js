// modules
let mysql = require('mysql');
let config = require("../config");

console.log(process.cwd())

function MatchMaker() {
    console.log("MatchMaker loaded.");

    this.db = mysql.createPool(config.dblogin);
    this.userTable = {};
    this.agentTable = {};
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
        return null;
    };

    this.generateMatch = function(userId) {
        return null;
    };

    this.getAllAgent = function() {
        let sql = 'SELECT * FROM agent';
        db.query(sql, (err, results) => {
            if (err) throw err;
            if (this.verbosity) console.log(`${results}`);
        });
    };

    this.verbose = function(bool) {
        if (bool === true) this.verbosity = true;
        return this
    };
};

// exports
exports.MatchMaker = MatchMaker;
