var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");

var buildFile = __dirname+"/../build/app.js";
//var buildFile = '/Users/hex0r/GitHub/isojs-demo/client/js/Routes.js';

var Routes = require('/Users/hex0r/GitHub/isojs-demo/client/js/Routes.js');

var bundleApp = function() {
	browserify({
			debug: true
		})
		.transform(babelify)
		.transform({
			global: true
		}, 'uglifyify')
		.require(buildFile, {
			entry: true
		})
		.bundle()
		.on("error", function(err) {
			console.log("Error: " + err.message);
		})
		.on("end", function() {
			console.log("en: ");
		})
		.pipe(fs.createWriteStream("./bundleBabel.js"));
};

module.exports = bundleApp;