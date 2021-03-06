//var fs = require('fs');
var Router = require('react-router');
var React = require('react');
var cycle = require('./cycle.js');

var render = function(req, res, next) {

	if (req.unijs.runs == null) {
		req.unijs.runs = 0;
	}
	if (req.unijs.fetchedData == null) {
		req.unijs.fetchedData = {};
	}
	if (req.unijs.head == null) {
		req.unijs.head = [];
	}
	if (req.unijs.body == null) {
		req.unijs.body = [];
	}
	if (req.unijs.options.debug && req.unijs.debugData == null) {
		req.unijs.debugData = {
			reactStarts: [],
			reactStops: [],
			start: Date.now(),
			stop: 0
		};
	}
	if (req.unijs.error == null) {
		req.unijs.error = function(error) {
			res.send('uniJs: An error occurred while rendering! ERROR: ' + JSON.stringify(error));
		}
	}

	var router = Router.create({
		routes: req.unijs.app.Router,
		location: req.unijs._url,
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

		req.unijs.unifyedRoute = unifyedRoute;
		req.unijs.state = state;
		req.unijs.Handler = Handler;
		req.unijs.appFactory = React.createFactory(Handler);
		req.unijs.appFactoryRendered = req.unijs.appFactory();

		cycle.run(req, res, next);
	});
}

module.exports = render;
