var fs = require("fs");
var db = require("./db.js");
var cheerio = require("cheerio");
var EventEmitter = require("events").EventEmitter;
var async = require("async");

var emitter = new EventEmitter();
emitter.on("save", db.save);
emitter.on("saved", function(bookmark) {
	console.log(bookmark.name);
});

var sourceData = fs.readFileSync("delicious.html", {encoding: "utf8"}).split("\n");

function processLine(line, next) {
	// console.log(arguments);
	if (line.indexOf("A HREF") !== -1) {
		line = line.trim().substr("<DT>".length);
		var node = cheerio.load(line)("a").first();
		var bookmark = {
			url: node.attr("href"),
			name: node.text(),
			tags: node.attr("tags").split(/[, ]/).filter(function(v) {
				return (v.trim().length > 0);
			}),
		};
		emitter.emit("save", bookmark, function() {
			emitter.emit("saved", bookmark);
			next();
		});
	} else {
		next();
	}
}

async.eachSeries(sourceData, processLine, function() {
	console.log("Done.");
	db.close();
});