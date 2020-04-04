function fulfill(req, res) {
	let message = [];
	let text = {
		"text": ["from server"]
	}
	if (req.body.queryResult.action === 'queue') {
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
