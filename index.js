var requireNodeJsOnly = require;

var checkLocation = require('./build/utils/checkLocation.js');
var cache = require('./build/render/cache.js');

var m = {};

m.checkLocation = checkLocation;
m.superagentPlugin = require('./build/exports/superagentPlugin.js');
m.extend = require('./build/exports/extend.js');
m.render = {
	cache: cache
};
m.Server = function() {
	checkLocation.setServer();
	return requireNodeJsOnly('./build/Server.js');
};

module.exports = m;
