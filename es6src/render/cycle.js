var React = require('react');

var fetchData = require('./fetchData.js');
var renderCache = require('./cache.js');
var renderCycleHelpers = require('./helpers.js');
var transmissionAlgorythm = require('../transmissions/algorythm.js');
var uniJsLog = require('../utils/log.js');

var renderCycleRun = function(req, res, next) {
	req.unijs.runs++;
	fetchData(req, res, next, function(req, res, next) {
		renderCycleHelpers.initializeCache(req);

		if (req.unijs.options.debug) {
			req.unijs.debugData.reactStarts.push(Date.now());
		}

		var html = React.renderToString(req.unijs.appFactoryRendered);

		if (req.unijs.options.debug) {
			req.unijs.debugData.reactStops.push(Date.now());
		}

		if (renderCache.cacheComplete === false) {
			transmissionAlgorythm.setNewTransmission();
			if (req.unijs.options.debug) {
				uniJsLog.debug('Set new Transmissions! Turn: ' + req.unijs.runs);
			}
		}
		var globalStateCache = renderCycleHelpers.loadStates();
		var stCache = {
			states: globalStateCache
		};
		req.unijs.reactState = stCache;
		req.unijs.reactHtml = html;

		if (renderCache.cacheComplete === false && req.unijs.runs < req.unijs.options.maxRuns) {
			renderCycleRun(req, res, next);
		} else {
			if (req.unijs.options.debug) {
				req.unijs.debugData.stop = Date.now();
				var totalRender = req.unijs.debugData.stop - req.unijs.debugData.start;
				var sum = 0;
				for (var i in req.unijs.debugData.reactStarts) {
					if (req.unijs.debugData.reactStops[i] != null) {
						sum += (req.unijs.debugData.reactStops[i] - req.unijs.debugData.reactStarts[i]);
					}
				}
				if(req.unijs.debugData.reactStarts.length > 0){
					var reactRenderTime = sum/req.unijs.debugData.reactStarts.length;
				} else {
					var reactRenderTime = 0;
				}
				uniJsLog.debug('Server-side rendered: Turns: ' + req.unijs.runs + ' Middle React-Rendertime: ' + reactRenderTime + ' Total Rendertime: ' + totalRender);
			}
			req.unijs.app._respond(req, res, next);
		}
	});
};

module.exports = {
	run: renderCycleRun
};
