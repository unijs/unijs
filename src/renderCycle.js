var React = require('react');

var fetchData = require('./fetchData.js');
var workData = require('./workData.js');
var renderCycleHelpers = require('./renderCycleHelpers.js');
var transmissionsAlgorythm = require('./transmissionsAlgorythm.js');
var isoJsLog = require('./isoJsLog.js');
var response = require('./response.js');

var renderCycleRun = function(req, res, next, callback) {
	req.isojs.runs++;
	fetchData(req, res, next, function(req, res, next) {
		cacheControl.initializeCache(req);

		var html = React.renderToString(req.isojs.appFactoryRendered);

		if (workData.cache.cacheComplete === false) {
			transmissionsAlgorythm.setNewTransmission();
			if (workData.config.debug) {
				isoJsLog.debug('Set new Transmissions! Turn: ' + req.isojs.runs);
			}
		}
		var globalStateCache = renderCycleHelpers.loadStates();
		var stCache = {
			states: globalStateCache
		};
		req.isojs.state = stCache;
		req.isojs.html = html;

		if (workData.cache.cacheComplete === false && req.isojs.runs < 5) {
			renderCycle(req, res, next, callback);
		} else {
			if (workData.config.debug) {
				isoJsLog.debug('Server-side rendered: Turns: ' + req.isojs.runs);
			}
			if (callback != null && typeof callback === 'function') {
				callback(req, res, next);
			} else {
				response.send(req, res, next);
			}
		}
	});
};

module.exports = {
	run: renderCycleRun
};
