var checkLocation = require('./checkLocation.js');
var requireNodeJsOnly = require;
var colors;

var uniJsLog = {
	log: function(text, ...args) {
		console.log('  uniJs: log    >', text);
		for (var i in args) {
			console.log('  #=>', args[i]);
		}
	},
	error: function(text, ...args) {
		console.log('  uniJs: error  >', text);
		for (var i in args) {
			console.log('  #=>', args[i]);
		}
	},
	warn: function(text, ...args) {
		console.log('  uniJs: warn   >', text);
		for (var i in args) {
			console.log('  #=>', args[i]);
		}
	},
	debug: function(text, ...args) {
		console.log('  uniJs: debug  >', text);
		for (var i in args) {
			console.log('  #=>', args[i]);
		}
	}
};

checkLocation.on('setServer', function() {
	colors = requireNodeJsOnly('colors');
	uniJsLog.log = function(text, ...args) {
		console.log('  uniJs: log    >'.green.bold, text);
		for (var i in args) {
			console.log('  #=>'.green.bold, args[i]);
		}
	};
	uniJsLog.error = function(text, ...args) {
		console.log('  uniJs: error  >'.red.bold, text.red.underline);
		for (var i in args) {
			console.log(i, args[i])
			console.log('  #=>'.red.bold, args[i].red.underline);
		}
	};
	uniJsLog.warn = function(text, ...args) {
		console.log('  uniJs: warn   >'.yellow.bold, text.yellow);
		for (var i in args) {
			console.log('  #=>'.yellow.bold, args[i].yellow);
		}
	};
	uniJsLog.debug = function(text, ...args) {
		console.log('  uniJs: debug  >'.magenta.bold, text);
		for (var i in args) {
			console.log('  #=>'.magenta.bold, args[i]);
		}
	};
});

module.exports = uniJsLog;
