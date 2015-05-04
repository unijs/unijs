var uglify = require("uglify-js");
var fs = require('fs');
var path = process.argv[0];

var fName = path+'/bundle.js';
var fNameMin = path+'/bundle.min.js';

var result = uglify.minify(fName);
fs.writeFileSync(fNameMin, result.code);
