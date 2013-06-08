function(doc) {
	function mapWord(word) {
		var m = word.match(/(.*?)[(?:\+\+)(--)](.*)/);
		var id = m && m[1];
		if (!id) return;
		m = word.match(/(.*?)((?:\+\+)+)\+?(.*)/);
		var plus = m && m[2].length;
		m = word.match(/(.*?)((?:--)+)-?(.*)/);
		var minus = m && m[2].length;
		var val = (plus - minus) / 2;
		if (val) emit(id, val);
	}

	function mapMessage(msg) {
		if (!msg.text || msg.ignore) return;
		msg.text.split(/\s+/).forEach(mapWord);
	}

	mapMessage(doc);
	if (doc.messages) doc.messages.forEach(mapMessage);
}
