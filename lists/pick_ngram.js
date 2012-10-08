// Pick a random ngram weighted by frequency.
function(head, req) {
	provides("json", function () {
		var allowEmpty = !("nonempty" in req.query);
		var total = 0;
		var rows = [];
		var row;
		while (row = getRow()) {
			if (allowEmpty || row.key.some(Boolean)) {
				rows.push(row);
				total += row.value;
				row.cumulative = total;
			}
		}
		var chosenIndex = Math.random() * total;
		var chosenNgram = null;
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row.cumulative > chosenIndex) {
				chosenNgram = row.key;
				break;
			}
		}
		return JSON.stringify(chosenNgram);
	});
}
