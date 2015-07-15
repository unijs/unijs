'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');
var requireNodeJsOnly = require;

var checkResource = function checkResource(path, callback) {
	var fs = requireNodeJsOnly('fs');
	fs.exists(path, function (yes) {
		if (!yes) {
			uniJsLog.error('Could not load resource from [' + path + ']!', err);
			return callback(err);
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
		this._resources = [];
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._head = [];
		this._path = '';
		this._apiUrl = 'http://localhost/';
	}

	_createClass(App, [{
		key: 'setApiUrl',
		value: function setApiUrl(apiUrl) {
			this._apiUrl = apiUrl;
		}
	}, {
		key: 'mount',
		value: function mount(callback) {
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
					that._head.push(that._path + '.f/' + resource._id + '.' + resource.type);
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
		key: 'render',
		value: function render(req, res, next) {
			return {
				head: ['<meta charset="utf-8">', '<script>var unijsGlobalStateCache = ' + JSON.stringify(req.unijs.reactState) + ';</script>'].concat(this.head).concat(req.unijs.head),
				body: ['<div id="main">' + req.unijs.reactHtml + '</div>'].concat(this.body).concat(req.unijs.body)
			};
		}
	}, {
		key: 'respond',
		value: function respond(req, res, next) {
			var render = req.unijs.app.render(req, res, next);
			var html = '\n\t   <html>\n\t      <head>\n\t      ' + render.head.join('') + '\n\t      </head>\n\t      <body>\n\t      ' + render.body.join('') + '\n\t      </body>\n\t   </html>\n\t   ';
			res.send(html);
		}
	}]);

	return App;
})();

module.exports = App;