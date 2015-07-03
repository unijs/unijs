'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');

var checkResource = function checkResource(path, callback) {
	fs.exists(path, function (err) {
		if (err) {
			uniJsLog.error('Could not load resource from [' + path + ']!', err);
			callback(err);
		};
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
		var resources = arguments[1] === undefined ? [] : arguments[1];

		_classCallCheck(this, App);

		this.head = [];
		this.body = [];
		this.resources = resources;
		this.Router = null;
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._path = '';
		this._apiUrl = 'http://localhost/';
	}

	_createClass(App, [{
		key: 'mount',
		value: function mount(callback) {
			this._hostfiles = [];
			var k = 0;
			for (var i in this.resources) {
				k++;
				checkResource(this.resources[i], function (err, resource) {
					k--;
					if (err) {
						return callback(err);
					}
					this._hostfiles.push(resource);
					if (k < 1) {
						callback();
					}
				});
			}
			if (k < 1) {
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
	}]);

	return App;
})();

module.exports = App;