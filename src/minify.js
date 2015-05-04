var uglify = require("uglify-js");
var fs = require('fs');

var fName = '../build/bundle.js';
var fNameMin = '../build/bundle.min.js';

var result = uglify.minify(fName);
fs.writeFileSync(fNameMin, result.code);
