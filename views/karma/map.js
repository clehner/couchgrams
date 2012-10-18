function(doc) {
	if (!doc.text || doc.ignore) return;
	doc.text.split(/\s+/).forEach(function (word) {
		var m = word.match(/(.*?)[(?:\+\+)(--)](.*)/);
		var id = m && m[1];
		if (!id) return;
		m = word.match(/(.*?)((?:\+\+)+)\+?(.*)/);
		var plus = m && m[2].length;
		m = word.match(/(.*?)((?:--)+)-?(.*)/);
		var minus = m && m[2].length;
		var val = (plus - minus) / 2;
		if (val) emit(id, val);
	});
}
