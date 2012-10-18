// Show karma count for all ids, sorted by karma
function(head, req) {
	var row, items = [];
	while (row = getRow()) {
		items.push({
			name: row.key,
			karma: row.value
		});
	}
	items.sort(function (a, b) {
		return b.karma - a.karma;
	});

	function outputJSON() {
		var map = {};
		items.forEach(function (item) {
			map[item.name] = item.karma;
		});
		return JSON.stringify(map);
	}

	function outputText() {
		return items.map(function (item) {
			return item.karma + " " + item.name;
		}).join("\n");
	}

	provides("json", outputJSON);
	if (req.query.format == "text")
		provides("text", outputText);
}
