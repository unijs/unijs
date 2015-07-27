var fs = require('fs');

var read = function(req, res, next, file) {
	fs.readFile(file.path, function(err, data) {
		if (err) {
			res.writeHead(404);
			return res.end("File not found.");
		}
		var contentType;
		switch (file.type) {
			case 'js':
				contentType = 'application/javascript';
				break;
			case 'css':
				contentType = 'text/css';
				break;
			case 'map':
				contentType = 'application/json';
				break;
			default:
				contentType = 'text/plain';
		}
		res.setHeader("Content-Type", contentType);
		res.writeHead(200);
		res.end(data);
	});
}

var hostFiles = function(req, res, next) {
	var match = false;
	if (req.unijs._path.substr(0, 4) === "/.f/") {
		for (var i = 0, len = req.unijs.app._hostfiles.length; i < len; i++) {
			if ('/.f/' + req.unijs.app._hostfiles[i]._id + '.' + req.unijs.app._hostfiles[i].type === req.unijs._path) {
				match = true;
				read(req, res, next, req.unijs.app._hostfiles[i]);
			}
		}
	}
	return match;
}

module.exports = hostFiles;
