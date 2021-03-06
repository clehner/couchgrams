CouchGrams
==========

N-grams, Markov chains, and karma in CouchDB. Intended as a database for an IRC bot.

Installation
------------

Use the [CouchApp](/couchapp/couchapp) utility or [erica](/benoitc/erica) as follows. 

    couchapp push . http://localhost:5984/<your_db>

API
---

The corpus consists of the `text` property of all documents without an `ignore` property.

For a shortcut for adding text to the corpus,

_PUT_ `_design/couchgrams/add_update` with a JSON object in the request body.
The object should have at least a string value for key `text`, and optionally
values for `sender` and `channel`.

To get a random n-gram given a prefix:

_GET_ `_design/couchgrams/_list/pick_ngram/ngrams?group_level=3&startkey=["Cats","are"]&endkey=["Cats","are",{}]&nonempty`

This will return an ngram such as ["Cats","are","cool"] or null if none match.
This address may need a cache-busting string appended to it, e.g. `&random=0981231023` See the example source for more information.

### Karma

Karma for id `name` is incremented by `name++` in the corpus and decremented with `name--` in the corpus. `name++++` increments by 2, `name--++-- decrements by 2, etc. This is in the style of [karma_bot](https://github.com/andrewwong1221/karma_bot).

To get karma for a name:

GET `_design/couchgrams/_rewrite/karma/<name>`

To get karma for all names, sorted by karma descending:

GET `_design/couchgrams/_rewrite/karma`

Append `?format=text` for textual output, otherwise JSON is returned.

Example App
-----------

`_design/couchgrams/index.html`

This simple web app lets you generate text using n-grams from your corpus.

Security
--------

Admins and users with the role `couchgrams` will be able to edit the corpus.

Importing Logs
--------------

There is a script included which lets you import IRC logs into the ngram corpus.
Currently only the irssi log format is supported.
The script `import_log.js` reads couchdb credentials from the same `.couchapprc`
file in the current directory that couchapp/erica reads.

```
./import_log.js ~/irclogs/*/#*.log
```

Todo
----

* Move import script stuff into a separate directory from the couchapp

