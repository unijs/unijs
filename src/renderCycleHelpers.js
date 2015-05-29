
var workData = require('./workData.js');

var initializeCache = function(req, res, next) {
	workData.cache.requests = [];
	workData.cache.unifyedRoute = req.isojs.unifyedRoute;
	workData.cache.fetchedData = req.isojs.fetchedData;
	workData.cache.state = req.isojs.state;
	workData.cache.req = req;
	workData.cache.stateComponents = [];
	workData.cache.cacheComplete = true;
};

var loadStates = function() {
	var exportStateCache = [];
	var len = workData.cache.stateComponents.length;
	for (var i = 0; i < len; i++) {
		var component = workData.cache.stateComponents.pop();
		exportStateCache.push(component.state);
	}
	return exportStateCache;
};

module.exports = {
	initializeCache: initializeCache,
	loadStates: loadStates
};
