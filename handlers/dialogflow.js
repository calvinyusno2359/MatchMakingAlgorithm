// modules
let rainbow = require("./rainbow");

// get matchmaker
let matchmaker = rainbow.matchmaker;

function fulfill(req, res) {
	if (req.body.queryResult.action === 'queue.number') getQueueNumber(req, res);
	else {
		res.send(req.body.queryResult);
	}
}

function getQueueNumber(req, res) {
		let rgx = new RegExp(`@number@`,"g");
		let userId = req.body.queryResult.parameters.userId

		let queueNumber = matchmaker.search(userId)[1]; // 0 is agentId
		console.log("HEREEEEEEEEEEEEEEEE:", queueNumber)
		if (queueNumber === null) queueNumber = "null, please try refreshing"

		req.body.queryResult.fulfillmentText = JSON.parse(JSON.stringify(req.body.queryResult.fulfillmentMessages).replace(rgx, queueNumber))
		req.body.queryResult.fulfillmentMessages = JSON.parse(JSON.stringify(req.body.queryResult.fulfillmentMessages).replace(rgx, queueNumber))
		res.send(req.body.queryResult);
}

// exports
exports.fulfill = fulfill;
