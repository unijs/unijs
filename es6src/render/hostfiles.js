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

var hostFiles = function hostFiles(req, res, next) {
	var match = false;
	var split = req.path.split('/');
	var file = split.pop();
	var folder = split.pop();
	if (folder === '.f') {
		for (var i = 0, len = req.unijs.app._hostfiles.length; i < len; i++) {
			var arr = file.split('.');
			if (req.unijs.app._hostfiles[i]._id === arr[0] && req.unijs.app._hostfiles[i].type === arr[1]) {
				match = true;
				read(req, res, next, req.unijs.app._hostfiles[i]);
				return true;
			}
		}
		res.writeHead(404);
		res.end('File not found.');
		return true;
	}
	return false;
};

module.exports = hostFiles;
