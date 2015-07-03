var requireNodeJsOnly = require;

var checkLocation = require('./src/checkLocation.js');
var Server = require('./es6src/Server.js');

var m = {};

m.App = require('./es6src/app.js');
m.Server = function(options) {

	var options = options || {};

   if(options.debug == null && "production" === process.env.NODE_ENV) {
      options.debug = false;
   } else {
      options.debug = !!(options.debug || false);
   }

   checkLocation.setServer();

   return Server(options);
}


m.checkLocation = checkLocation;
m.superagentPlugin = require('./src/superagentPlugin.js');
m.renderCache = require('./src/renderCache.js');
m.Class = require('./src/es6Class_build.js');
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
