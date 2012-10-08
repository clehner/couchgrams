function(doc, req) {
	// can't update text this way
	if (doc) return [null, {
		code: 409,
		body: "conflict"
	};

	var text = req.body;
	var doc = {
		_id: Math.round(new Date()/1000).toString(),
		text: text
	};
	return [doc, "ok"];
}
