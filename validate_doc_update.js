function (doc, oldDoc, userCtx) {
	if (userCtx.roles.indexOf('couchgrams' == -1) &&
		userCtx.roles.indexOf('_admin') == -1) {
		throw {unauthorized: 'Not permitted'};
	}
}
