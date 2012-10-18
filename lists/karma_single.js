// Show karma count for an id
function(head, req) {
	provides("text", function () {
		start({headers: {"Content-Type": "text/plain"}});
		var row = getRow();
		return row.value.toString();
	});
}
