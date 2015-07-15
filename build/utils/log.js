'use strict';

var checkLocation = require('./checkLocation.js');
var requireNodeJsOnly = require;
var colors;

var uniJsLog = {
	log: function log(text) {
		console.log('  uniJs: log    >', text);

		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		for (var i in args) {
			console.log('  #=>', toString(args[i]));
		}
	},
	error: function error(text) {
		console.log('  uniJs: error  >', text);

		for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			args[_key2 - 1] = arguments[_key2];
		}

		for (var i in args) {
			console.log('  #=>', toString(args[i]));
		}
	},
	warn: function warn(text) {
		console.log('  uniJs: warn   >', text);

		for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
			args[_key3 - 1] = arguments[_key3];
		}

		for (var i in args) {
			console.log('  #=>', toString(args[i]));
		}
	},
	debug: function debug(text) {
		console.log('  uniJs: debug  >', text);

		for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
			args[_key4 - 1] = arguments[_key4];
		}

		for (var i in args) {
			console.log('  #=>', toString(args[i]));
		}
	}
};

checkLocation.on('setServer', function () {
	colors = requireNodeJsOnly('colors');
	uniJsLog.log = function (text) {
		console.log('  uniJs: log    >'.green.bold, text);

		for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
			args[_key5 - 1] = arguments[_key5];
		}

		for (var i in args) {
			console.log('  #=>'.green.bold, toString(args[i]));
		}
	};
	uniJsLog.error = function (text) {
		console.log('  uniJs: error  >'.red.bold, text.red.underline);

		for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
			args[_key6 - 1] = arguments[_key6];
		}

		for (var i in args) {
			console.log('  #=>'.red.bold, toString(args[i]).red.underline);
		}
	};
	uniJsLog.warn = function (text) {
		console.log('  uniJs: warn   >'.yellow.bold, text.yellow);

		for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
			args[_key7 - 1] = arguments[_key7];
		}

		for (var i in args) {
			console.log('  #=>'.yellow.bold, toString(args[i]).yellow);
		}
	};
	uniJsLog.debug = function (text) {
		console.log('  uniJs: debug  >'.magenta.bold, text);

		for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
			args[_key8 - 1] = arguments[_key8];
		}

		for (var i in args) {
			console.log('  #=>'.magenta.bold, toString(args[i]));
		}
	};
});

module.exports = uniJsLog;