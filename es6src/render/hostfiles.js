var hostFiles = function(req, res, next) {
	var match = false;
	if (req.unijs._path.substr(0, 4) === "/.f/") {
		for (var i = 0, len = req.unijs.app._hostfiles.length; i < len; i++) {
			if ('/.f/' + req.unijs.app._hostfiles[i]._id + '.' + req.unijs.app._hostfiles[i].type === req.unijs._path) {
				match = true;
				fs.readFile(req.unijs.app._hostfiles[i].path, function(err, data) {
					if (err) {
						res.writeHead(404);
						return res.end("File not found.");
					}
					var contentType;
					switch (req.unijs.app._hostfiles[i].type) {
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
