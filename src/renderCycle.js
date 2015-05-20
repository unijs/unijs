var React = require('react');

var fetchData = require('./fetchData.js');
var workData = require('./workData.js');
var renderCycleHelpers = require('./renderCycleHelpers.js');
var transmissionAlgorythm = require('./transmissionAlgorythm.js');
var isoJsLog = require('./isoJsLog.js');
var response = require('./response.js');

var renderCycleRun = function(req, res, next, callback) {
	req.isojs.runs++;
	fetchData(req, res, next, function(req, res, next) {
		renderCycleHelpers.initializeCache(req);

		if (workData.config.debug) {
			req.isojs.debugData.reactStarts.push(Date.now());
		}

		var html = React.renderToString(req.isojs.appFactoryRendered);

		if (workData.config.debug) {
			req.isojs.debugData.reactStops.push(Date.now());
		}

		if (workData.cache.cacheComplete === false) {
			transmissionAlgorythm.setNewTransmission();
			if (workData.config.debug) {
				isoJsLog.debug('Set new Transmissions! Turn: ' + req.isojs.runs);
			}
		}
		var globalStateCache = renderCycleHelpers.loadStates();
		var stCache = {
			states: globalStateCache
		};
		req.isojs.reactState = stCache;
		req.isojs.reactHtml = html;

		if (workData.cache.cacheComplete === false && req.isojs.runs < workData.config.maxRuns) {
			renderCycleRun(req, res, next, callback);
		} else {
			if (workData.config.debug) {
				req.isojs.debugData.stop = Date.now();
				var totalRender = req.isojs.debugData.stop - req.isojs.debugData.start;
				var sum = 0;
				for (var i in req.isojs.debugData.reactStarts) {
					if (req.isojs.debugData.reactStops[i] != null) {
						sum += (req.isojs.debugData.reactStops[i] - req.isojs.debugData.reactStarts[i]);
					}
				}
				if(req.isojs.debugData.reactStarts.length > 0){
					var reactRenderTime = sum/req.isojs.debugData.reactStarts.length;
				} else {
					var reactRenderTime = 0;
				}
				var reactRenderTime = req.isojs.debugData.stop - req.isojs.debugData.start;
				isoJsLog.debug('Server-side rendered: Turns: ' + req.isojs.runs + ' Middle React-Rendertime: ' + reactRenderTime + ' Total Rendertime: ' + totalRender);
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
