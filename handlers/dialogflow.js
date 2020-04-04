// modules
let rainbow = require("./rainbow");

// get matchmaker
let matchmaker = rainbow.matchmaker;

function fulfill(req, res) {
	if (req.body.queryResult.action === 'queue.number') getQueueNumber(req, res);
	else if (req.body.queryResult.action === 'queue.agentId') getAgentId(req, res);
	else if (req.body.queryResult.action === 'queue.tag') getTag(req, res);
	else res.send(req.body.queryResult);
}

function getQueueNumber(req, res) {
	let rgx = new RegExp(`@number@`,"g");
	let userId = req.body.queryResult.parameters.userId

	let queueNumber = matchmaker.search(userId)[1]; // 0 is agentId
	req.body.queryResult.parameters['queueNumber'] = queueNumber;
	if (queueNumber === null) queueNumber = "null, please try refreshing";

	req = replace(req, rgx, queueNumber);
	res.send(req.body.queryResult);
}

function getAgentId(req, res) {
	let rgx = new RegExp(`@agentId@`,"g");
	let userId = req.body.queryResult.parameters.userId

	let agentId = matchmaker.search(userId)[0];
	req.body.queryResult.parameters['agentId'] = agentId;
	if (agentId === null) agentId = "null, you are not currently matched to any agent.";

	req = replace(req, rgx, agentId);
	res.send(req.body.queryResult);
}

function getTag(req, res) {
	let rgx = new RegExp(`@tag@`,"g");
	let userId = req.body.queryResult.parameters.userId

	let agentId = matchmaker.userTable[userId];

	let tag = "null, you are not currently matched to any agent.";
	for (var i=0; i<matchmaker.availTable.length; i++) {
		if (matchmaker.availTable[i].id === agentId) {
			tag = matchmaker.availTable[i].tag;
			break
		}
	}

	req.body.queryResult.parameters['tag'] = tag;

	req = replace(req, rgx, tag);
	res.send(req.body.queryResult);
}

function replace(req, rgx, val) {
	req.body.queryResult.fulfillmentText = req.body.queryResult.fulfillmentText.replace(rgx, val);
	req.body.queryResult.fulfillmentMessages = JSON.parse(JSON.stringify(req.body.queryResult.fulfillmentMessages).replace(rgx, val));
	return req
}

function getOldParam(req, name) {
	let contextList = req.body.queryResult.outputContexts;
	let context = req.body.queryResult.outputContexts[0];
	let param = context.paramters[name];
	return param;
}

// exports
exports.fulfill = fulfill;
