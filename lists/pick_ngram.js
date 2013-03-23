// Pick a random ngram weighted by frequency.
function(head, req) {
	provides("json", function () {
		var allowEmpty = !("nonempty" in req.query);

		// Two modes. If chosenIndex is null, read all rows and pick a random
		// one. If chosenIndex is a number, read up to the row with that
		// cumulative value, and return it.
		var chosenNgram = null;
		var chosenIndex = req.query.i;
		var random = chosenIndex == null;

		var total = 0;
		var rows = [];
		var row;
		while (row = getRow()) {
			if (allowEmpty || row.key.some(Boolean)) {
				total += row.value;
				if (random) {
					row.cumulative = total;
					rows.push(row);
				} else if (total > chosenIndex) {
					chosenNgram = row.key;
					return JSON.stringify(chosenNgram);
				}
			}
		}

		chosenIndex = Math.random() * total;
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
