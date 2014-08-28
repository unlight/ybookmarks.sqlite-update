var config = require("./config.json");
var dblite = require("dblite");
var db = dblite(config.dbpath);
var async = require("async");

exports.save = save;
exports.close = close;

function save(bookmark, callback) {
	// console.log('save');
	// console.log(arguments);
	// process.exit();
	// TODO: Add transaction.
	// db.query("begin transaction");
	db.query("select rowid from bookmarks where url = ?", [bookmark.url], onSelectBookmark);
	function onSelectBookmark(err, rows) {
		if (err) throw err;
		var row = rows[0];
		if (!row) {
			async.parallel([
				async.apply(insertBookmark, bookmark),
				async.apply(insertTags, bookmark.tags),
			], function(err, result) {
				insertRelation.apply(null, result);
				// db.query("commit transaction");
				if (typeof callback == "function") {
					callback();
				}
			});
		} else {
			// TODO: Update.
			callback();
			// throw "Something found.";
		}
	}
}

function insertTags(tags, callback) {
	// console.log('insertTags');
	var tagIds = [];
	async.eachSeries(tags, function(name, done) {
		db.query("select rowid, name from tags where name = ?", [name], function(err, rows) {
			if (err) throw err;
			var row = rows[0];
			if (!row) {
				db.query("insert into tags values(?)", [name]);
				lastInsertRowid(function(err, newId) {
					tagIds.push(newId);
					done();
				});
			} else {
				tagIds[tagIds.length] = row[0];
				done();
			}
		});
	}, function() {
		callback(null, tagIds);
	});
}

function insertBookmark(data, callback) {
	// console.log('insertBookmark');
	db.query("insert into bookmarks (name, url) values(?, ?)", [data.name, data.url]);
	lastInsertRowid(callback);
}

function insertRelation(bookmarkId, tagIds) {
	// console.log('insertRelation', bookmarkId, tagIds);
	// process.exit();
	for (var i = tagIds.length - 1; i >= 0; i--) {
		var tagId = tagIds[i];
		db.query("insert into bookmarks_tags(bookmark_id, tag_id) values(?, ?)", [bookmarkId, tagId]);
	};
}

function lastInsertRowid(callback) {
	db.query("select last_insert_rowid()", function(err, rows) {
		if (err) throw err;
		callback(null, rows[0][0]);
	});
}

function close() {
	db.close();
}