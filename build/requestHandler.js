'use strict';

var render = require('./render/index.js');
var uniJsLog = require('./utils/log.js');

var appStore = require('./appStore.js');

var requestHandler = function requestHandler(options) {
	return function (req, res, next, callback) {
		uniJsLog.log('Request Received!');
		for (var i = 0, len = appStore.length; i < len; i++) {
			uniJsLog.log('Rendering APP!');
			if (req.url.substr(0, appStore[i]._path.length) === appStore[i]._path) {
				req.path = req.url.substr(appStore[i]._path.length);
				render(appStore[i], options, req, res, next, callback);
				break;
			}
		}
		//next();
	};
};

module.exports = requestHandler;