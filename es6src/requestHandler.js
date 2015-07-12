
var render = require('./render/index.js');

var appStore = require('./appStore.js');

var requestHandler = function(options) {
	return function(req, res, next, callback) {
		for (var i = 0, len = appStore.length; i < len; i++) {
			if (req.url.substr(0, appStore[i]._path.length) === appStore[i]._path) {
				req.path = req.url.substr(appStore[i]._path.length);
            return render(appStore[i], options, req, res, next, callback);
			}
		}
		next();
	}
}

module.exports = requestHandler;
