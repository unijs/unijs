
var renderCache = require('./renderCache.js');

var initializeCache = function(req, res, next) {
	renderCache.requests = [];
	renderCache.unifyedRoute = req.isojs.unifyedRoute;
	renderCache.fetchedData = req.isojs.fetchedData;
	renderCache.state = req.isojs.state;
	renderCache.req = req;
	renderCache.stateComponents = [];
	renderCache.cacheComplete = true;
};

var loadStates = function() {
	var exportStateCache = [];
	var len = renderCache.stateComponents.length;
	for (var i = 0; i < len; i++) {
		var component = renderCache.stateComponents.pop();
		exportStateCache.push(component.state);
	}
	return exportStateCache;
};

module.exports = {
	initializeCache: initializeCache,
	loadStates: loadStates
};
