let {PythonShell} = require('python-shell');
let path = require("path");
let config = require("../config");

// define a new array method
Object.defineProperty(Array.prototype, 'prioritySort', {
    enumerable: false,
    value: function(agentIds) {
        // get array of sorted index whose value is biggest to lowest
        let priority = [];
        let sortedScores = this.slice().sort(function(a, b){return b-a});
        for (var i=0; i<sortedScores.length; i++) {
            let index = this.indexOf(sortedScores[i]);
            priority.push(agentIds[index]);
        }
        return priority;
    }
})

function MatchMaker() {
    console.log("MatchMaker loaded.");

    this.userTable = {};
    this.agentTable = {};

    this.matchUser = async function(userId) {
        // matches both agent and user together if user is not matched already, returns agentId
        // done by writing a value to the key in userAgent and agentTable

        if (this.userTable[userId] != null) {
            let agentId = this.userTable[userId];
            let message = `This user has already been matched!`;
            console.log(message);
            return agentId;

        // go through priority list and try to match user and agent
        } else {
            let agentPriority = await this.generateMatch(userId);

            for (var i=0; i<agentPriority.length; i++) {
                let agentId = agentPriority[i];
                if (this.agentTable[agentId] == null) {
                    // double record on both tables
                    this.userTable[userId] = agentId;
                    this.agentTable[agentId] = userId;

                    let message = `Success! A matching Agent: ${agentId} has been found for User: ${userId}.`;
                    console.log(message);
                    return agentId;
                }
            }
            let message = `Failure! A match cannot be found, it seems all agents are busy.`;
            console.log(message);
            return null;
        }
    };

    this.disconnectUser = async function(userId) {
        // disconnects user and agent
        // done by writing null to agentTable and deleting user from userTable

        let agentId = this.userTable[userId];
        if (this.agentTable[agentId] == userId) {
            delete this.userTable[userId];
            this.agentTable[agentId] = null;

            let message = `Success! User: ${userId} has been disconnected from ${agentId}.`
            console.log(message);
            return message;
        } else {
            let message = `Failure! User: ${userId} cannot be found!`
            console.log(message);
            return message;
        }

    }

    this.matchAgent = function(agentId) {
        if (this.agentTable[agentId] != null) {
            let userId = this.agentTable[agentId];
            let message = `This Agent: ${agentId} has found a match!`;
            console.log(message);
            return userId;
        } else {
            let message = `Failure! This Agent: ${agentId} is not connected to anyone.`;
            console.log(message);
            return null;
        }

    }

    this.addAgent = function(agentId) {
        // adds agent if not inside already
        if (agentId in this.agentTable) {
            let message = `Failure! Agent: ${agentId} was already inside!`;
            return message;
        } else {
            this.agentTable[agentId] = null;
            let message = `Success! Agent: ${agentId} has been added to agentTable!`;
            return message;
        }
    }

    this.generateMatch = function(userId) {
        return new Promise((resolve, reject) => {
            let script = "matchmake.py";
            let pyshell = new PythonShell(path.join(__dirname, script), config.options);

            let agentIds = Object.keys(this.agentTable);
            let agentPriority;

            pyshell.send(JSON.stringify(agentIds));

            pyshell.on('message', function (message) {
                let agentScores = JSON.parse(message);
                agentPriority = agentScores.prioritySort(agentIds);
                console.log(agentPriority);

            });

            pyshell.on('stderr', function (stderr) {
                console.log(stderr);
            });

            pyshell.end(function (err, code, signal) {
                if (err) {
                    let message = `Failure! A match cannot be found, returning null.`;
                    console.log(message);
                    reject(err)
                };
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log(`${script} finished`);
                message = `Success! Matches has been generated for User: ${userId}.`;
                console.log(message);
                resolve(agentPriority);
            });
        });
    }
};

// exports
exports.MatchMaker = MatchMaker;
