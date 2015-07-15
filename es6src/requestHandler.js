var render = require('./render/index.js');
var uniJsLog = require('./utils/log.js');
var hostFiles = require('./render/hostfiles.js');

var appStore = require('./appStore.js');

var requestHandler = function(options) {
	return function(req, res, next) {
		uniJsLog.log('Request Received!');
		for (var i = 0, len = appStore.length; i < len; i++) {
			uniJsLog.log('Rendering APP!');
			if (req.url.substr(0, appStore[i]._path.length) === appStore[i]._path) {
				//req._path = req.url.substr(appStore[i]._path.length);

				if (req.unijs == null) {
					req.unijs = {};
				}
				req.unijs.options = options;
				req.unijs.app = appStore[i];
				req.unijs._url = req.url.substr(appStore[i]._path.length);
				req.unijs._path = req.path.substr(appStore[i]._path.length);
				uniJsLog.log('Initializing Request', req.unijs);

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

module.exports = requestHandler;
