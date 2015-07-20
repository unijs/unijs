var hashText = require('./utils/hash.js').text;
var uniJsLog = require('./utils/log.js');
var requireNodeJsOnly = require;

var checkResource = function(path, callback) {
	var fs = requireNodeJsOnly('fs');
	fs.exists(path, function(yes) {
		if (!yes) {
			uniJsLog.error(`Could not load resource from [${path}]!`);
			return callback(`Could not load resource from [${path}]!`);
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
		this.charset = 'utf-8';
		this._resources = [];
		this._name = name;
		this._mounted = false;
		this._hostfiles = [];
		this._head = [];
		this._body = [];
		this._path = "";
	}

	getApiUrl(req, res, next) {
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

	_mount(callback) {
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

	_render(req, res, next) {
		return {
			head: [
				`<meta charset="${this.charset}"></meta>`,
				`<script>var unijsGlobalStateCache = ${JSON.stringify(req.unijs.reactState)};</script>`
			].concat(this.head).concat(this._head).concat(req.unijs.head),
			body: [
				`<div id="main">${req.unijs.reactHtml}</div>`
			].concat(this.body).concat(this._body).concat(req.unijs.body)
		};
	}

	_respond(req, res, next) {
		var render = req.unijs.app._render(req, res, next);
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
