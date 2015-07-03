
var React = require('react');
var Router = require('react-router');

var renderCycle = require('./renderCycle.js');

var isoJsMiddleware = function(config) {
	return function(req, res, next, callback) {
		if (req.isojs == null) {
			req.isojs = {};
		}
		req.isojs.config = config;
		if (req.isojs.runs == null) {
			req.isojs.runs = 0;
		}
		if (req.isojs.fetchedData == null) {
			req.isojs.fetchedData = {};
		}
		if (req.isojs.head == null) {
			req.isojs.head = [];
		}
		if (req.isojs.body == null) {
			req.isojs.body = [];
		}
		if (req.isojs.config.debug && req.isojs.debugData == null) {
			req.isojs.debugData = {
				reactStarts: [],
				reactStops: [],
				start: Date.now(),
				stop: 0
			};
		}
		if (req.isojs.error == null) {
			req.isojs.error = function(error) {
				res.send('isoJS: An error occurred while rendering! ERROR: ' + JSON.stringify(error));
			}
		}

		var router = Router.create({
			routes: req.isojs.config.routes,
			location: req.url,
			onAbort: function defaultAbortHandler(abortReason, location) {
				var path = router.makePath(abortReason.to, abortReason.params, abortReason.query);
				res.redirect(301, path)
			}
		});
		router.run(function(Handler, state) {
			var unifyedRouteTemp = [];
			for (var i in state.routes) {
				unifyedRouteTemp.push(state.routes[i].name);
			}
			var unifyedRoute = '/' + unifyedRouteTemp.join('/');

			req.isojs.unifyedRoute = unifyedRoute;
			req.isojs.state = state;
			req.isojs.Handler = Handler;
			req.isojs.appFactory = React.createFactory(Handler);
			req.isojs.appFactoryRendered = req.isojs.appFactory();

			renderCycle.run(req, res, next, callback);
		});
	}
}

module.exports = isoJsMiddleware;
