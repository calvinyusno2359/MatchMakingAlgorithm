function fulfill(req, res) {
	if (req.body.queryResult.action === 'queue') {
		req.body.queryResult.fulfillmentMessages = "from server"
		res.send(req.body);
	}
	res.send(req.body.queryResult);
}

// exports
exports.fulfill = fulfill;
