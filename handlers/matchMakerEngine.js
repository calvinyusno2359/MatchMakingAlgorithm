// modules
let dotenv = require('dotenv').config({ path: '../.env' });
let matchMakerDb = require("./matchMakerDb");
let queue = require("./queue");

function MatchMaker() {

    this.availTable = []; // populate all available agent and their info
    this.userTable = {}; // dictionary of {userId: agentId}
    this.userTags = {}; // dictionary of {userId: tag}
    this.agentTable = {}; // dictionary of {agentId: userIdQ}
    this.verbosity = false;

    this.matchUser = async function(userId, tag) {
        // matches both agent and user together if user is not matched already, returns agentId or "WAIT"
        // if user is matched alr, then return either wait signal (if not topQ) or the agentId (if topQ)
        // done by writing a value to the key in userAgent and agentTable

        let matchedAgent = this.userTable[userId] || null;

        if (matchedAgent != null) { // user has been matched
            let message = `This ${userId} has already been matched!`;
            if (this.verbosity) console.log(message);

            // check if userId is topQ or not and respond accordingly
            if (this.agentTable[matchedAgent].peek() == userId) return matchedAgent;
            else return "WAIT";

        } else { // user is new
            let agentId = await this.generateMatch(tag);
            if (agentId == null) return null;

            let message = `This ${userId} is matched with ${agentId}!`;
            console.log(message);

            // write to agentTable and userTable & update db
            this.agentTable[agentId].enqueue(userId);
            this.userTable[userId] = agentId;
            this.userTags[userId] = tag;
            if (this.verbosity) {
                console.log(message);
                console.log(this.agentTable);
                console.log(this.userTable);
            }

            // update db

            // if topQ, returns agentId, else WAIT
            if (this.agentTable[agentId].peek() == userId) return agentId;
            else return "WAIT";
        }
    };

    this.disconnectUser = async function(userId) {
        // disconnects user and agent
        // done by dequeueing user from agentTable Q and deleting user from userTable

        let agentId = this.userTable[userId] || null;
        if (agentId == null) {
            let message = `Failure! User: ${userId} is not currently connected.`
            if (this.verbosity) console.log(message);
            return message;

        } else if (this.agentTable[agentId].peek() == userId) {
            delete this.userTable[userId];
            delete this.userTags[userId];
            this.agentTable[agentId].dequeue();
            this.availableListener(agentId);

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
        return this;
    };

    this.removeAgent = function(agentId) {
        // removes agent if not removed already
        if (agentId in this.agentTable) {
            let message = `Success! Agent: ${agentId} has been removed from agentTable!`;
            delete this.agentTable[agentId];
            if (this.verbosity) console.log(message);
        } else {
            let message = `Failure! Agent: ${agentId} is already removed!`;
            if (this.verbosity) console.log(message);
        }
        return this;
    };

    this.generateMatch = function(tag) {
        // given a tag, find agentId whose Q is the shortest, return agentId
        return new Promise((resolve, reject) => {
            matchMakerDb.generateMatch.call(this, tag, function(matchedAgent) {
                resolve(matchedAgent);
            })
        });
    };

    this.getAllAvailableAgent = function() {
        // used for initial startup and when new agent is added/deleted
        // get all available agent => populate availTable and agentTable
        return new Promise((resolve, reject) => resolve(matchMakerDb.getAllAvailableAgent.call(this)));
    };

    this.canMatch = async function(user, agent) {
        if (await this.generateMatch(this.userTags[user]) == agent) {
            return true;
        } else {
            return false;
        }
    };

    this.verbose = function(bool) {
        if (bool === true) this.verbosity = true;
        return this;
    };

    this.search = function(userId) {
        // returns agentId and queueNumber of this userId
        let matchedAgent = this.userTable[userId] || null;
        if (matchedAgent === null) return [null, null];
        else {
            let queue = this.agentTable[matchedAgent];
            let queueNumber = queue.search(userId);
            return [matchedAgent, queueNumber];
        }
    }

    this.availableListener = function(agentId) {
    		// if this agentId is free, steal from another agent's Q index 1
        if (this.agentTable[agentId].length() == 0) {
            let targetQ = null;
            let maxLength = 1;

            // get the person from longest queue who can match with agent
            Object.keys(this.agentTable).forEach((agent) => {
                if (this.agentTable[agent].length() > maxLength) {
                    if (this.canMatch(this.agentTable[agent].peek2(), agentId)) {
                        targetQ = this.agentTable[agent];
                        maxLength = targetQ.length();
                    }
                }
            });

            if (targetQ != null) {
            		let userId = targetQ.steal();
                this.agentTable[agentId].enqueue(userId);
                this.userTable[userId] = agentId;
            }
        }
    }
};

// exports
exports.MatchMaker = MatchMaker;
