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
	senderInput = document.getElementById("name");
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
	var sender = senderInput.value.trim() || null;
	getWords(sender, input.value, function (word) {
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

function getWords(sender, start, wordCb) {
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
				pickNgram(sender, nextPrefix, n, next);
				return;
			}
		}
		stop2();
	}(startNgram));
}

function encodeObject(arg) {
	return encodeURIComponent(JSON.stringify(arg));
}

function pickNgram(prefixName, prefixWords, groupLevel, cb) {
	loadJSON("_list/pick_ngram/ngrams?nonempty&group_level=" + (1 + groupLevel) +
		"&startkey=" + encodeObject([prefixName].concat(prefixWords, "")) +
		"&endkey=" + encodeObject([prefixName].concat(prefixWords, {})) +
		"&nocache=" + Math.random().toString().substr(2), function (resp) {
			cb(resp && resp.slice(1));
    });
}
