function fulfill(req, res) {
	res.send(req.body);
}

// exports
exports.fulfill = fulfill;
