var browserify = require('browserify');
var fs = require('fs');

var fName = '../build/bundle.js';
var fNameMin = '../build/bundle.min.js';

var b = browserify();
b.add('../build/app.js');
var ws = fs.createWriteStream(fName);
ws.on('finish', function(){
	console.log('finish');
});
b.bundle().pipe(ws);
