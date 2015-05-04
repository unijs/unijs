var browserify = require('browserify');
var fs = require('fs');
var path = process.argv[0];

var fName = path+'/bundle.js';
var fNameMin = path+'/bundle.min.js';

var b = browserify();
b.add(path+'/app.js');
var ws = fs.createWriteStream(fName);
ws.on('finish', function(){
	console.log('finish');
});
b.bundle().pipe(ws);
