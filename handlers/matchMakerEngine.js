function MatchMaker() {
  console.log("MatchMaker loaded.");

  this.userTable = {};
  this.agentTable = {};

  this.matchUser = function(userId) {
    // matches both agent and user together if user is not matched already, returns agentId
    // done by writing a value to the key in userAgent and agentTable

    if (this.userTable[userId] != null) {
      let agentId = this.userTable[userId];
      let message = `This user has already been matched!`;
      console.log(message);
      return agentId;
    }

    else {
      let agentId = this.generateMatch(userId);

      if (agentId != null) {
        // double record on both tables
        this.userTable[userId] = agentId;
        this.agentTable[agentId] = userId;

        let message = `Success! User: ${userId} has been paired with ${agentId}.`;
        console.log(message);
        return agentId;
      }

      else {
        let message = `Failure! A match cannot be found, it seems all agents are busy.`;
        console.log(message);
        return null;
      }
    }
  };

  this.disconnectUser = function(userId) {
    // disconnects user and agent
    // done by writing null to agenttable and deleting user from userTable

    let agentId = this.userTable[userId];
    if (this.agentTable[agentId] == userId) {
      delete this.userTable[userId];
      this.agentTable[agentId] = null;

      let message = `Success! User: ${userId} has been disconnected from ${agentId}.`
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
    }

    else {
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
    }

    else {
      this.agentTable[agentId] = null;
      let message = `Success! Agent: ${agentId} has been added to agentTable!`;
      return message;
    }
  }

  this.generateMatch = function(userId) {
    // TODO: algorithm to generate match given user id, returns agentId

    // this one just gets any agent that is free
    for (agentId of Object.keys(this.agentTable)) {

      if (this.agentTable[agentId] == null) {
        let message = `Success! A matching Agent: ${userId} has been found for User: ${agentId}.`;
        console.log(message);
        return agentId;
      }

      else {
        let message = `Failure! A match cannot be found, returning null.`;
        console.log(message);
        return null;
      }
    }
  }

};

// exports
exports.MatchMaker = MatchMaker;
