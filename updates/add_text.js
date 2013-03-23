function(doc, req) {
	if (!doc) doc = {
		_id: req.id || (new Date()/1000).toString()
	};
	try {
		var params = JSON.parse(req.body);
		doc.text = params.text;
		doc.sender = params.sender;
		doc.channel = params.channel;
		return [doc, "ok"];
	} catch(e) {
		return [null, "fail"];
	}
}
