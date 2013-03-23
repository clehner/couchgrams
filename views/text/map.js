function (doc) {
	if (doc.text != null) {
		emit(doc._id, null);
	}
}
