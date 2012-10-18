function(doc, req) {
	if (!doc) doc = {
		_id: req.id || (new Date()/1000).toString()
	};
	doc.text = req.body;
	return [doc, "ok"];
}
