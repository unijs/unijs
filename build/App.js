'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');
var cache = require('./render/cache.js');
var requireNodeJsOnly = require;

var checkResource = function checkResource(path, callback) {
	var fs = requireNodeJsOnly('fs');
	fs.exists(path, function (yes) {
		if (!yes) {
			uniJsLog.error('Could not load resource from [' + path + ']!');
			return callback('Could not load resource from [' + path + ']!');
		}
		var ext = path.split('.').pop();
		callback(null, {
			_id: hashText(path),
			path: path,
			type: ext
		});
	});
};

var App = (function () {
	function App(name) {
		var resources = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		_classCallCheck(this, App);

		this.head = [];
		this.body = [];
		this.resources = resources;
		this.Router = null;
		this.charset = 'utf-8';
		this._resources = [];
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._head = [];
		this._body = [];
		this._path = '';
	}

	_createClass(App, [{
		key: 'getApiUrl',
		value: function getApiUrl(req, res, next) {
			var protocol = 'http';
			var host = 'localhost';
			var path = '/';
			if (req.protocol != null && typeof req.protocol === 'string' && (req.protocol === 'http' || req.protocol === 'https')) {
				protocol = req.protocol;
			}
			if (req.headers != null && req.headers.host != null && typeof req.headers.host === 'string' && req.headers.host !== '') {
				host = req.headers.host;
			}
			if (req.path != null && typeof req.path === 'string' && req.path !== '') {
				path = req.path;
			}
			return protocol + '://' + host + path;
		}
	}, {
		key: '_mount',
		value: function _mount(callback) {
			this._hostfiles = [];
			this._head = [];
			var k = 0;
			var arr = this.resources.concat(this._resources);
			var that = this;
			for (var i in arr) {
				k++;
				checkResource(arr[i], function (err, resource) {
					k--;
					if (err) {
						return callback(err);
					}
					that._hostfiles.push(resource);
					switch (resource.type) {
						case 'js':
							that._head.push('<script type="text/javascript" src="' + (that._path + '.f/' + resource._id + '.' + resource.type) + '"></script>');
							break;
						case 'css':
							that._head.push('<link rel="stylesheet" type="text/css" href="' + (that._path + '.f/' + resource._id + '.' + resource.type) + '">');
							break;
						default:
							uniJsLog.warn('Resource Type is not supported!', resource);
					}
					if (k < 1) {
						that._resources = [];
						callback();
					}
				});
			}
			if (k < 1) {
				this._resources = [];
				callback();
			}
		}
	}, {
		key: '_unmount',
		value: function _unmount(callback) {
			callback();
		}
	}, {
		key: '_render',
		value: function _render(req, res, next) {
			return {
				head: ['<meta charset="' + this.charset + '"></meta>', '<style>' + cache.css + '</style>', '<script>var unijsGlobalStateCache = ' + JSON.stringify(req.unijs.reactState) + ';</script>'].concat(this.head).concat(this._head).concat(req.unijs.head),
				body: ['<div id="main">' + req.unijs.reactHtml + '</div>'].concat(this.body).concat(this._body).concat(req.unijs.body)
			};
		}
	}, {
		key: '_respond',
		value: function _respond(req, res, next) {
			var render = req.unijs.app._render(req, res, next);
			var html = '\n\t   <html>\n\t      <head>\n\t      ' + render.head.join('') + '\n\t      </head>\n\t      <body>\n\t      ' + render.body.join('') + '\n\t      </body>\n\t   </html>\n\t   ';
			res.send(html);
		}
	}]);

	return App;
})();

module.exports = App;