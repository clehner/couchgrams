#!/usr/bin/env node
// Read logs from irssi and post them to CouchDB
// todo: parse other log formats

var fs = require('fs'),
	request = require('request'),
	IrssiLogParser = require('node-irssi-log-parser');

if (process.argv.length < 3) {
	console.error('Usage: ./import_log.js channel.log [channel2.log ...]');
	return;
}
var logFiles = process.argv.slice(2);

var couchappRc;
try {
	couchappRc = JSON.parse(fs.readFileSync('.couchapprc'));
} catch(e) {
	console.error('Unable to read JSON from .couchapprc');
}
var defaultCouchapp = couchappRc && couchappRc.env && couchappRc.env['default'];
var db = defaultCouchapp && defaultCouchapp.db;
if (!db) {
	console.error('Missing env.default.db in .couchapprc');
	return;
}
var dbSanitized = db.replace(/(\/\/.*?):(.*?)@/, '$1:********@');
console.log('Will write to', dbSanitized);

var messages;

function onMessage(event) {
	messages.push({
		date: event.time.getTime(),
		text: event.message,
		sender: event.nick
	});
}

function onAction(event) {
	event.text = '/me ' + event.message;
	onMessage(event);
}

var parser = new IrssiLogParser({
	regexps: {
		message: /^(\d\d:\d\d(?::\d\d)?)\s*<(.)([^>]+)> (.*)$/,
		action: /^(\d\d:\d\d(?::\d\d)?)\s*\*\s*(\S+) (.*)$/
	}
});
//parser.onAll(onMessage);
parser.on('message', onMessage);
parser.on('action', onAction);

var chunkSize = 1000;

function importLogFile(file, cb) {
	var channel = file.match(/.*\/(.*?)(\.log)?$/)[1];
	messages = [];

	console.log('Reading log for ' + channel);
	parser.parse(file);

	var i = 0;
	(function next() {
		if (i < messages.length) {
			var chunk = messages.slice(i, i + chunkSize);
			console.log('Uploading messages ' + i + '-' + (i + chunkSize));
			i += chunkSize;
			uploadMessages(channel, chunk, next);
		} else {
			cb();
		}
	}());
}

function uploadMessages(channel, messages, cb) {
	var doc = {
		channel: channel,
		messages: messages
	};

	if (messages.length) {
		var startTime = messages[0].date / 1000,
			endTime = messages[messages.length-1].date / 1000;
		doc._id = startTime + '-' + endTime;
	}

	request.put({
		url: db + '/' + doc._id,
		json: true,
		body: doc
	}, function (error, response, body) {
		var status = response.statusCode;
		if (!error && status == 200 || status == 201 || body.ok) {
			console.log('Posted', messages.length, 'messages.');
		} else if (status == 403) {
			console.error('403 Forbidden');
		} else if (status == 409) {
			console.error('Document update conflict');
		} else {
			console.error('There was an error:',
				error, status, body);
		}
		cb();
	});
}

function importLogFiles(files) {
	if (!files.length) return;
	importLogFile(files[0], function() {
		importLogFiles(files.slice(1));
	});
}

importLogFiles(logFiles);

