function blanks(n) {
	return new Array(n).join(" ").split(" ");
}

function(doc) {
	var n = 3;
	if (!doc.text || doc.ignore) return;
	doc.text.split(/\s*[\n\r]+\s*/).forEach(function (line) {
		if (!line) return;
		var words = blanks(n-1).concat(line.split(/\s+/), blanks(n));
		for (var i = n; i < words.length; i++) {
			var ngram = words.slice(i-n, i);
			emit(ngram, null);
		}
	});
}
