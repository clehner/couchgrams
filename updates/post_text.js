function(doc, req) {
	// only allow putting new text, not updating old text
	if (doc) return [null, {
		code: 409,
		body: "conflict"
	}];

	var text = req.body;
	var doc = {
		_id: (new Date()/1000).toString(),
		text: text
	};
	return [doc, "ok"];
}
