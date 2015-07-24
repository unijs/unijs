var render = require('./render/index.js');
var uniJsLog = require('./utils/log.js');
var hostFiles = require('./render/hostfiles.js');

var appStore = require('./appStore.js');

var getMiddleware = function(options) {
	return function(req, res, next) {
		for (var i = 0, len = appStore.length; i < len; i++) {
			if (req.url.substr(0, appStore[i]._path.length) === appStore[i]._path) {
				//req._path = req.url.substr(appStore[i]._path.length);

				if (req.unijs == null) {
					req.unijs = {};
				}
				req.unijs.options = options ||  {};
				if (!req.unijs.options.maxRuns) {
					req.unijs.options.maxRuns = 5;
				}
				if (!req.unijs.options.debug) {
					req.unijs.options.debug = false;
				}
				req.unijs.app = appStore[i];
				req.unijs._url = req.url.substr(appStore[i]._path.length - 1);
				req.unijs._path = req.path.substr(appStore[i]._path.length - 1);

				if (hostFiles(req, res, next)) {
					return;
				}

				render(req, res, next);
				break;
			}
		}
		//next();
	}
}

module.exports = getMiddleware;
