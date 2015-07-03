'use strict';

var appStore = require('./appStore.js');
var uniJsLog = require('./utils/log.js');

var mount = function mount(path, app, callback) {
	var pathlength = path.split('/').length;
	var i = 0;
	for (i = 0, len = appStore.length; i < len; i++) {
		if (appStore[i]._path === path) {
			return callback('Path already registered!');
		}
		if (appStore[i]._path.split('/').length <= pathlength) {
			break;
		}
	}
	app._path = path;
	arr.splice(i, 0, app); // Insert app at the correct place in Apps Array
	app.mount(function (err) {
		if (err) {
			uniJsLog.error('Could not mount app at [' + path + ']!', err);
		}
		app._mounted = true;
	});
};