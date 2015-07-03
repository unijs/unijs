'use strict';

var checkLocation = require('./checkLocation.js');
var requireNodeJsOnly = require;
var colors;

var uniJsLog = {
	log: function log(text) {
		console.log('  uniJs: log    >', text);
	},
	error: function error(text) {
		console.log('  uniJs: error  >', text);
	},
	warn: function warn(text) {
		console.log('  uniJs: warn   >', text);
	},
	debug: function debug(text) {
		console.log('  uniJs: debug  >', text);
	}
};

checkLocation.on('setServer', function () {
	colors = requireNodeJsOnly('colors');
	uniJsLog.log = function (text) {
		console.log('  uniJs: log    >'.green.bold, text);
	};
	uniJsLog.error = function (text) {
		console.log('  uniJs: error  >'.red.bold, text.red.underline);
	};
	uniJsLog.warn = function (text) {
		console.log('  uniJs: warn   >'.yellow.bold, text.yellow);
	};
	uniJsLog.debug = function (text) {
		console.log('  uniJs: debug  >'.magenta.bold, text);
	};
});

module.exports = uniJsLog;