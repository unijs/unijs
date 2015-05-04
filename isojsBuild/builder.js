var browserify = require('browserify');

var fName = './bundle.js';
var fNameMin = './bundle.min.js';
var fs = require('fs');

var b = browserify();
b.add('./app.js');
var ws = fs.createWriteStream(fName);
ws.on('finish', function(){
	console.log('finish');
});
b.bundle().pipe(ws);
