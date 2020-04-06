// modules
let mysql = require('mysql');
let config = require("../config");

// Create connection
let db = mysql.createPool(config.dblogin);

function generateMatch(tag, callback) {
    let sql = `SELECT * FROM agent WHERE availability = 1 AND FIND_IN_SET(${mysql.escape(tag)}, tag)`;
    db.query(sql, (err, agents) => {
        if (err) throw err;

        // get candidates that is available and has tag
        let candidates = JSON.parse(JSON.stringify(agents));
        let matchedAgent = "5e7875a7ae2042244e4317d1"; // default GP
        let maxQ = 99999;
        let lowestQIndex;

        // check which one has minimum queue => is the matchedAgent
        for (var i = 0; i < candidates.length; i++) {
            let q = this.agentTable[candidates[i].id];
            if (q.length() == 0) {
                lowestQIndex = i;
                break;
            } else if (q.length() < maxQ) {
                maxQ = q.length();
                lowestQIndex = i;
                matchedAgent = candidates[i].id;
            }
            matchedAgent = candidates[lowestQIndex].id;
        }
        if (candidates.length > 0) matchedAgent = candidates[lowestQIndex].id;

        if (this.verbosity) {
            console.log("candidates:", candidates);
            console.log("matchedAgent:", matchedAgent);
        }
        return callback(matchedAgent);
    });
}

function matchUser() {

}

function getAllAvailableAgent() {
    let sql = 'SELECT * FROM agent WHERE `availability` = 1 ';
    let agents = db.query(sql, (err, agents) => {
        if (err) throw (err);

        // populate availTable
        this.availTable = JSON.parse(JSON.stringify(agents));

        // then register every avail agent to agentTable
        for (var i = 0; i < this.availTable.length; i++) this.addAgent(this.availTable[i].id)

        if (this.verbosity) {
            console.log("availTable:", this.availTable);
            console.log("agentTable:", this.agentTable);
        }
        return this;
    });
}

exports.generateMatch = generateMatch;
exports.getAllAvailableAgent = getAllAvailableAgent;
