function fulfill(req, res) {
	if (req.body.queryResult.action === 'queue') {
		req.body.queryResult.fulfillmentMessages = "from server"
		res.send(req.body.queryResult);
	}
	else {
		res.send(req.body);
	}
}

// exports
exports.fulfill = fulfill;
