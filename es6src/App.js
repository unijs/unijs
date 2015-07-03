var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');

var checkResource = function(path, callback) {
	fs.exists(path, function(err) {
		if (err) {
			uniJsLog.error(`Could not load resource from [${path}]!`, err);
			callback(err);
		};
		var ext = path.split('.').pop();
		callback(null, {
			_id: hashText(path),
			path: path,
			type: ext
		});
	});
}

class App {
	constructor(name, resources = []) {
		this.head = [];
		this.body = [];
		this.resources = resources;
		this.Router = null;
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._path = "";
		this._apiUrl = "http://localhost/";
	}

	mount(callback) {
		this._hostfiles = [];
		var k = 0;
		for (var i in this.resources) {
			k++;
			checkResource(this.resources[i], function(err, resource) {
				k--;
				if (err) {
					return callback(err);
				}
				this._hostfiles.push(resource)
				if (k < 1) {
					callback();
				}
			});
		}
		if (k < 1) {
			callback();
		}
	}

	render(req, res, next) {
		return {
			head: [
				'<meta charset="utf-8">',
				`<script>var unijsGlobalStateCache = ${JSON.stringify(req.unijs.reactState)};</script>`
			].concat(this.head).concat(req.unijs.head),
			body: [
				`<div id="main">${req.unijs.reactHtml}</div>`
			].concat(this.body).concat(req.unijs.body)
		};
	}
}

module.exports = App;
