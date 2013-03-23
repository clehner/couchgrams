function(head, req) {
	provides("text", function () {
		if (!req.query.include_docs) {
			return "";
		}
		var row;
		while (row = getRow()) {
			if (row.doc && row.doc.text != null) {
				send(row.doc.text + "\n");
			}
		}
	});
}
