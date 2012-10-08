CouchGrams
==========

N-grams in CouchDB

API
---

The corpus consists of the `text` property of all documents without an `ignore` property.

For a shortcut for adding text to the corpus,

_POST_ `_design/couchgrams/post_update` with the text in the request body.

To get a random n-gram given a prefix:

_GET_ `_design/couchgrams/_list/pick_ngram/ngrams?group_level=3&startkey=["Cats","are"]&endkey=["Cats","are",{}]&nonempty`

This will return an ngram such as ["Cats","are","cool"] or null if none match.
This address may need a cache-busting string appended to it, e.g. `&random=0981231023` See the example source for more information.

Example App
-----------

`_design/couchgrams/index.html`

This simple web app lets you generate text using n-grams from your corpus.

Security
--------

Currently no document security is provided - any CouchDB user can edit the corpus. You may use [per-database security](http://wiki.apache.org/couchdb/Security_Features_Overview) to secure the corpus.
