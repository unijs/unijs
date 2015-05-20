
var checkLocation = require('./checkLocation.js');
var requireNodeJsOnly = require;
var colors;

var isoJsLog = {
	log: function(text) {
		console.log('  isoJS: log    >', text);
	},
	error: function(text) {
		console.log('  isoJS: error  >', text);
	},
	warn: function(text) {
		console.log('  isoJS: warn   >', text);
	},
	debug: function(text) {
		console.log('  isoJS: debug  >', text);
	}
};

checkLocation.on('setServer', function() {
	colors = requireNodeJsOnly('colors');
	isoJsLog = {
		log: function(text) {
			console.log('  isoJS: log    >'.green.bold, text);
		},
		error: function(text) {
			console.log('  isoJS: error  >'.red.bold, text.red.underline);
		},
		warn: function(text) {
			console.log('  isoJS: warn   >'.yellow.bold, text.yellow);
		},
		debug: function(text) {
			console.log('  isoJS: debug  >'.magenta.bold, text);
		}
	};
});

module.exports = isoJsLog;
