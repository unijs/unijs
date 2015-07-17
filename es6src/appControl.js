var appStore = require('./appStore.js');
var uniJsLog = require('./utils/log.js');
var server = require('./server.js');

var mount = function(path, app, callback) {
	uniJsLog.log('Mounting APP...');
	if (path[path.length - 1] !== '/') {
		path += '/';
	}
	var pathlength = path.split('/').length;
	var i = 0,
		len;
	for (i = 0, len = appStore.length; i < len; i++) {
		if (appStore[i]._path === path) {
			if (callback && typeof callback === 'function') {
				callback("Path already registered!");
			}
			return;
		}
		if (appStore[i]._path.split('/').length <= pathlength) {
			break;
		}
	}
	app._path = path;
	appStore.splice(i, 0, app); // Insert app at the correct place in Apps Array
	app.mount(function(err) {
		if (err != null) {
			return uniJsLog.error(`Could not mount app at [${path}]!`, err);
		}
		uniJsLog.log('APP Mounted!');
		app._mounted = true;
		if (callback && typeof callback === 'function') {
			callback();
		}
	});
}

var unmount = function(path) {
	if (typeof path !== 'string') {
		path = path._path;
	}
	var i = 0,
		len;
	for (i = 0, len = appStore.length; i < len; i++) {
		if (appStore[i]._path === path) {
			break;
		}
	}
	var app = arr.splice(i, 1);
	app._mounted = false;
	app._path = "";
}


module.exports = {
	mount: mount
}
