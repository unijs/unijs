var hostFiles = function(app, req, res) {
	var match = false;
	if (req.path.substr(0, 4) === "/.f/") {
		for (var i = 0, len = app._hostfiles.length; i < len; i++) {
			if ('/.f/' + app._hostfiles[i]._id + '.' + app._hostfiles[i].type === req.path) {
				match = true;
				fs.readFile(app._hostfiles[i].path, function(err, data) {
					if (err) {
						res.writeHead(404);
						return res.end("File not found.");
					}
					var contentType;
					switch (app._hostfiles[i].type) {
						case 'js':
							contentType = 'application/javascript';
							break;
						case 'css':
							contentType = 'text/css';
							break;
						default:
							contentType = 'text/plain';
					}
					res.setHeader("Content-Type", contentType);
					res.writeHead(200);
					res.end(data);
				});
			}
		}
	}
	return match;
}

module.exports = hostFiles;
