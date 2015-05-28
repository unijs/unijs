var requireNodeJsOnly = require;

var m = {};

m.checkLocation = require('./src/checkLocation.js');
m.superagentPlugin = require('./src/superagentPlugin.js');
var mixins = require('./src/mixins.js');
m.loadMixin = mixins.loadMixin;
m.stateMixin = mixins.stateMixin;
m.createServer = null;
m.appBuilder = null;

m.checkLocation.on('setServer', function() {
	m.createServer = requireNodeJsOnly('./src/isojs.js');
	m.appBuilder = requireNodeJsOnly('./src/appBuilder.js').build;
});

module.exports = m;
