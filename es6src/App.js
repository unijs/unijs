var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');
var requireNodeJsOnly = require;

var checkResource = function(path, callback) {
	var fs = requireNodeJsOnly('fs');
	fs.exists(path, function(yes) {
		if (!yes) {
			uniJsLog.error(`Could not load resource from [${path}]!`, err);
			return callback(err);
		}
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
		this._resources = [];
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._head = [];
		this._path = "";
		this._apiUrl = "http://localhost/";
	}

	setApiUrl(apiUrl) {
		this._apiUrl = apiUrl;
	}

	mount(callback) {
		this._hostfiles = [];
		this._head = [];
		var k = 0;
		var arr = this.resources.concat(this._resources);
		var that = this;
		for (var i in arr) {
			k++;
			checkResource(arr[i], function(err, resource) {
				k--;
				if (err) {
					return callback(err);
				}
				that._hostfiles.push(resource);
				switch (resource.type) {
					case 'js':
						that._head.push(`<script type="text/javascript" src="${that._path + '.f/' + resource._id + '.' + resource.type}"></script>`);
						break;
					case 'css':
						that._head.push(`<link rel="stylesheet" type="text/css" href="${that._path + '.f/' + resource._id + '.' + resource.type}">`);
						break;
					default:
						uniJsLog.warn('Resource Type is not supported!', resource)
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

	render(req, res, next) {
		return {
			head: [
				'<meta charset="utf-8"></meta>',
				`<script>var unijsGlobalStateCache = ${JSON.stringify(req.unijs.reactState)};</script>`
			].concat(this.head).concat(req.unijs.head),
			body: [
				`<div id="main">${req.unijs.reactHtml}</div>`
			].concat(this.body).concat(req.unijs.body)
		};
	}

	respond(req, res, next) {
		var render = req.unijs.app.render(req, res, next);
		var html = `
	   <html>
	      <head>
	      ${render.head.join('')}
	      </head>
	      <body>
	      ${render.body.join('')}
	      </body>
	   </html>
	   `;
		res.send(html);
	}
}

module.exports = App;
