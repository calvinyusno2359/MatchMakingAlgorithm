// modules
let rainbow = require("./rainbow");

// get matchmaker
let matchmaker = rainbow.matchmaker;

async function fulfill(req, res) {
	let message = [];
	let text = {
		"text": ["from server"]
	}
	if (req.body.queryResult.action === 'queue') {
		req.body.queryResult.fulfillmentText = "from server 1";
		res.send(req.body.queryResult);
	}
	else if (req.body.queryResult.action === 'queue.number') {
		let val = 1;
    let rgx = new RegExp(`@number@`,"g");

		req.body.queryResult.fulfillmentMessages = JSON.parse(JSON.stringify(req.body.queryResult.fulfillmentMessages).replace(rgx, val))
		res.send(req.body.queryResult);
	}
	else {
		res.send(req.body.queryResult);
	}
}

// exports
exports.fulfill = fulfill;
