function fulfill(req, res) {
	let message = [];
	let text = {
		"text": ["from server"]
	}
	if (req.body.queryResult.action === 'queue') {
		req.body.queryResult.fulfillmentMessages = message.push(text);
		res.send(req.body.queryResult);
	}
	else {
		res.send(req.body.queryResult);
	}
}

// exports
exports.fulfill = fulfill;
