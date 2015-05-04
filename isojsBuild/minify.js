var uglify = require("uglify-js");
var fs = require('fs');

var fName = './bundle.js';
var fNameMin = './bundle.min.js';

var result = uglify.minify(fName);
fs.writeFileSync(fNameMin, result.code);
