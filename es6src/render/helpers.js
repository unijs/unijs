var renderCache = require('./cache.js');

var initializeCache = function(req, res, next) {
	renderCache.requests = [];
	renderCache.unifyedRoute = req.unijs.unifyedRoute;
	renderCache.fetchedData = req.unijs.fetchedData;
	renderCache.state = req.unijs.state;
	renderCache.req = req;
	renderCache.stateComponents = [];
	renderCache.external = {};
	renderCache.css = '';
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
