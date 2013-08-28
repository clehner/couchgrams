function(doc) {
	var sender;

	function blanks(n) {
		return new Array(n).join(" ").split(" ");
	}

	function mapLine(line) {
		if (!line) return;
		var n = 3;
		var words = blanks(n-1).concat(line.split(/\s+/), blanks(n));
		for (var i = n; i < words.length; i++) {
			var ngram = words.slice(i-n, i);
			emit([null].concat(ngram), null);
			if (sender) {
				emit([sender].concat(ngram), null);
			}
		}
	}

	function mapMessage(msg) {
		if (!msg.text || msg.ignore) return;
		sender = msg.sender;
		msg.text.split(/\s*[\n\r]+\s*/).forEach(mapLine);
	}

	mapMessage(doc);
	if (doc.messages) doc.messages.forEach(mapMessage);
}
