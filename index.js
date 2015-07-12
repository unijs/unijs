var requireNodeJsOnly = require;

var checkLocation = require('./build/utils/checkLocation.js');

var m = {};


m.checkLocation = checkLocation;
m.superagentPlugin = require('./build/exports/superagentPlugin.js');
m.extend = require('./build/exports/extend.js');
m.Server = function(){
	checkLocation.setServer();
	return requireNodeJsOnly('./build/Server.js');
};

module.exports = m;
