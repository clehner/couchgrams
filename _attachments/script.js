function loadJSON(url, cb) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4) return;
        try {
            var data = JSON.parse(r.responseText);
		} catch(e) {
        } finally {
            cb(data);
            delete r.onreadystatechange;
            delete r;
        }
    };
    r.send(null);
}

var n = 3,
	form, input, resultsEl, nChooser, resetBtn;

function init() {
	form = document.getElementById("form");
	input = document.getElementById("input-text");
	resultsEl = document.getElementById("results");
	nChooser = document.getElementById("grams");
	stopBtn = document.getElementById("stop-btn");

	form.addEventListener("submit", onSubmit, false);
	stopBtn.addEventListener("click", stop, false);
	nChooser.addEventListener("change", onNChange, false);
}

function onSubmit(e) {
	e.preventDefault();
	stop();
	resultsEl.innerHTML = "";
	getWords(input.value, function (word) {
		resultsEl.appendChild(document.createTextNode(word + " "));
	});
}

function onNChange(e) {
	n = +nChooser.value;
}

var stop2;
function stop() {
	if (stop2) stop2();
}

function blanks(n) {
	return new Array(n).join(" ").split(" ");
}

function getWords(start, wordCb) {
	var stopped = false;
	stop2 = function () {
		stopped = true;
		stopBtn.disabled = true;
	};
	stopBtn.disabled = false;

	// get the last n words in the given start string
	var words = start.split(/\s+/);
	var startNgram =
		words.length < n ? blanks(n-words.length).concat(words) :
		words.slice(words.length - n, words.length);
	// keep getting next words from successive ngrams, max 100
	var i = 0;
	(function next(ngram) {
		if (ngram && !stopped && i++ < 100) {
			wordCb(ngram[ngram.length-1]);
			var nextPrefix = ngram.slice(1, n);
			if (i == 1 || n == 1 || nextPrefix.some(Boolean)) {
				// Stop at the end of a line
				pickNgram(nextPrefix, n, next);
				return;
			}
		}
		stop2();
	}(startNgram));
}

function encodeObject(arg) {
	return encodeURIComponent(JSON.stringify(arg));
}

var meow = (location.hash.indexOf('meow') !== -1);

function pickNgram(prefixWords, groupLevel, cb) {
	var startkey = encodeObject(prefixWords.concat(""));
	var endkey = encodeObject(prefixWords.concat({}));
	if (meow) {
		pickNgram3(prefixWords, groupLevel, startkey, endkey, cb);
	} else {
		pickNgram2(prefixWords, groupLevel, startkey, endkey, cb);
	}
}

// Pick an ngram in one request. O(N)
function pickNgram2(prefixWords, groupLevel, startkey, endkey, cb) {
	// Have couchdb iterate through all the resulting rows and pick one
	loadJSON("_list/pick_ngram/ngrams?nonempty&group_level=" + groupLevel +
		"&startkey=" + startkey +
		"&endkey=" + endkey +
		"&nocache=" + Math.random().toString().substr(2), cb);
}

// Pick an ngram in two requests. O(N/4)
function pickNgram3(prefixWords, groupLevel, startkey, endkey, cb) {
	// Get max rows, pick a value from that, and then find that row
	loadJSON("_view/ngrams?" +
			"&startkey=" + startkey +
			"&endkey=" + endkey, function (res) {
		var max = res && res.rows && res.rows[0] && res.rows[0].value
		var index = max * Math.random();

		// Optimization: if the index is in the second half, reverse the
		// query and we will iterate on average half as far
		var descending = index > max/2;
		if (descending) {
			var tmp = startkey;
			startkey = endkey;
			endkey = tmp;
			index = max - index;
		}
		console.log(max, index, descending);
		loadJSON("_list/pick_ngram/ngrams?group_level=" + groupLevel +
				"&descending=" + descending +
				"&i=" + index +
				"&startkey=" + startkey +
				"&endkey=" + endkey, cb);
	});
}
