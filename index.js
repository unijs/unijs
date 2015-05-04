require("node-jsx").install({
	extension: ".js"
});

var checkLocation = require('./src/checkLocation.js');

var React = require('react');
var Router = require('react-router');
var superagent = require('superagent');
var url = require('url');

var requireNodeJsOnly = require;

var colors, express, fs, exec;

var isoJSlog = {
	log: function(text) {
		console.log('  isoJS: log    >', text);
	},
	error: function(text) {
		console.log('  isoJS: error  >', text);
	},
	warn: function(text) {
		console.log('  isoJS: warn   >', text);
	},
	debug: function(text) {
		console.log('  isoJS: debug  >', text);
	}
};

checkLocation.on('setServer', function() {
	colors = requireNodeJsOnly('colors');
	express = requireNodeJsOnly('express');
	fs = requireNodeJsOnly('fs-extra');
	exec = requireNodeJsOnly('child_process').exec;
	isoJSlog = {
		log: function(text) {
			console.log('  isoJS: log    >'.green.bold, text);
		},
		error: function(text) {
			console.log('  isoJS: error  >'.red.bold, text.red.underline);
		},
		warn: function(text) {
			console.log('  isoJS: warn   >'.yellow.bold, text.yellow);
		},
		debug: function(text) {
			console.log('  isoJS: debug  >'.magenta.bold, text);
		}
	};
});


var interns = {
	cache: {
		unifyedRoute: '',
		requests: [],
		fetchedData: {},
		stateComponents: [],
		cacheComplete: true
	},
	transmissions: {

	},
	config: {
		getApiServerAddress: function() {
			return 'http://localhost/';
		},
		routesPath: './Route.js',
		scripts: [],
		stylesheets: [],
		buildPath: './isojsBuild/',
		uglify: false
	},
	configRequierements: ['routesPath'],
	buildState: 0,
	routes: {}
};

var createServer = function(config) {
	checkLocation.setServer();
	isoJSlog.log('Initializing app...');
	if (config == null && interns.configRequierements.length > 0) {
		return isoJSlog.error('(createServer): Expected an config object!');
	}
	for (var i in interns.configRequierements) {
		if (config[interns.configRequierements[i]] == null) {
			return isoJSlog.error('(createServer): The config option [' + interns.configRequierements[i] + '] is required!');
		}
	}
	for (var i in config) {
		if (interns.config[i] == null) {
			interns.config[i] = config[i];
		} else {
			if (typeof interns.config[i] === typeof config[i]) {
				interns.config[i] = config[i];
			} else {
				return isoJSlog.error('(createServer): The config option [' + i + '] needs to be typeof [' + (typeof interns.config[i]) + ']. You passed a [' + (typeof config[i]) + ']');
			}
		}
	}
	isoJSlog.log('1. Load routes file...');
	try {
		var directPath = process.cwd() + '/' + interns.config.routesPath;
		interns.routes = requireNodeJsOnly(directPath);
	} catch (err) {
		return isoJSlog.error('(createServer): Could not find routes at "' + directPath + '"!');
	}
	var appText = "var isojs = require('../isojs.js'); isojs.checkLocation.setClient(); var React = require('react'); var Router = require('react-router'); var routes = require('" + directPath + "'); Router.run(routes, Router.HistoryLocation, function (Handler) { React.render(<Handler/>, document.getElementById('main')); });";


	fs.outputFile(interns.config.buildPath + 'app.js', appText, function(err) {
		if (err) {
			return isoJSlog.error('(createServer): Failed to create build dir: "' + interns.config.buildPath + 'app.js"!', err);
		}

		isoJSlog.log('2. Build browserify bundle...');

		exec('node builder.js', {
			cwd: './isojsBuild'
		}, function(error, stdout, stderr) {
			if (error) {
				return isoJSlog.error('(createServer): Failed to build browserify bundle...');
			}
			interns.buildState++;
			if (interns.config.uglify) {
				isoJSlog.log('APP Ready! :) [bundle not minifyed]');
				isoJSlog.log('3. Build minifyed bundle...');
				exec('node minify.js', {
					cwd: './isojsBuild'
				}, function(error, stdout, stderr) {
					if (error) {
						return isoJSlog.error('(createServer): Failed to build browserify bundle...');
					}
					interns.buildState++;
					isoJSlog.log('APP Ready! :) [bundle minifyed]');
				});
			} else {
				isoJSlog.warn('NOTE: Enable config.uglify in production to decrease webapp size.');
				isoJSlog.log('APP Ready! :)');
			}
		});

	});



	return render;
};

var render = function() {

	var app = express();

	app.use(function(req, res, next) {
		if (interns.buildState < 1) {
			res.status(503).send('<h1>ERROR: 503 Service Unavailable</h1><br><h4>The isoJS server is still building the webapp. Try again in a about a minute.</h4>');
		} else {
			next();
		}
	});

	app.use('/bundle.min.js', function(req, res, next) {
		var file = "bundle.js";
		if (interns.buildState > 1) {
			file = "bundle.min.js";
		}

		fs.readFile('./isojsBuild/' + file, function(err, data) {
			if (err) {
				res.writeHead(404);
				return res.end("File not found.");
			}
			res.setHeader("Content-Type", "application/javascript");
			res.writeHead(200);
			res.end(data);
		});
	});

	app.use(function(req, res, next) {
		if (req.isojs == null) {
			req.isojs = {};
		}
		if (req.isojs.runs == null) {
			req.isojs.runs = 0;
		}
		if (req.isojs.fetchedData == null) {
			req.isojs.fetchedData = {};
		}
		req.isojs.timetrace = [];
		req.isojs.timetrace.push({
			time: Date.now(),
			text: 'start'
		});
		//req.runs++;
		var router = Router.create({
			routes: interns.routes,
			location: req.url,
			onAbort: function defaultAbortHandler(abortReason, location) {
				var path = router.makePath(abortReason.to, abortReason.params, abortReason.query);
				res.redirect(301, path)
			}
		});
		router.run(function(Handler, state) {
			//console.log('STA >', state);
			var unifyedRouteTemp = [];
			for (var i in state.routes) {
				unifyedRouteTemp.push(state.routes[i].name);
			}
			var unifyedRoute = '/' + unifyedRouteTemp.join('/');

			req.isojs.unifyedRoute = unifyedRoute;
			req.isojs.state = state;
			req.isojs.Handler = Handler;
			req.isojs.appFactory = React.createFactory(Handler);
			req.isojs.appFactoryRendered = req.isojs.appFactory();
			req.isojs.timetrace.push({
				time: Date.now(),
				text: 'routed + factory'
			});
			fetchAndRespond(req, res, next);
		});

	});
	return app;
};

var fetchAndRespond = function(req, res, next) {
	req.isojs.runs++;
	fetchData(req, res, next, function(req, res, next) {
		req.isojs.timetrace.push({
			time: Date.now(),
			text: 'fetched'
		});
		//console.log('fetchedData', fetchedData);
		initializeCache(req);

		var html = React.renderToString(req.isojs.appFactoryRendered);

		if (interns.cache.cacheComplete === false) {
			setNewTransmission();
			console.log('SET TRANSMISSION ======================');
		}
		var globalStateCache = loadStates();
		var stCache = {
			states: globalStateCache
		};
		//console.log('STATES: ', JSON.stringify(stCache));
		req.isojs.timetrace.push({
			time: Date.now(),
			text: 'renderToString + transmissions'
		});

		if (interns.cache.cacheComplete === false && req.isojs.runs < 5) {
			fetchAndRespond(req, res, next);
		} else {
			console.log('TIMETRACE ================');
			for (var i in req.isojs.timetrace) {
				console.log(req.isojs.timetrace[i].time - req.isojs.timetrace[0].time, req.isojs.timetrace[i].text);
			}
			console.log('TIMETRACE ================');

			console.log('RENDERTIME:', Date.now() - req.isojs.timetrace[0].time, 'RELOADS', req.isojs.runs);

			res.send('<!doctype html><html lang="en"><head><meta charset="utf-8">' +
				'<title>isoJS</title>' +
				'<link rel="stylesheet" href="/font/dosis.css"/>' +
				'<link rel="stylesheet" href="/css/app.css"/>' +
				'</head>' +
				'<body><div id="main">' + html + '</div></body>' +
				'<script>var globalStateCache = ' +
				JSON.stringify(stCache) +
				'</script>' +
				'<script src="/bundle.min.js"></script></html>');
		}
	});
};

var fetchData = function(req, res, next, done) {
	if (interns.transmissions[req.isojs.unifyedRoute] == null) {
		return done(req, res, next);
	}
	var requests = interns.transmissions[req.isojs.unifyedRoute];
	var fetchedData = {};
	var j = 0;
	for (var i in requests) {
		var replacements = requests[i].replacements;
		var request = JSON.parse(JSON.stringify(requests[i].req));
		request = applyTransmission(req.isojs.state, request, replacements);

		var reqUrl = url.resolve(interns.config.getApiServerAddress(), request.url);
		//console.log('reqUrl', reqUrl);
		var pendingRequest = superagent;
		switch (request.method.toUpperCase()) {
			case 'GET':
				pendingRequest = pendingRequest.get(reqUrl);
				break;
			case 'POST':
				pendingRequest = pendingRequest.post(reqUrl);
				break;
			default:
				console.info('Not supported request method! (' + request.method + ') isoJS Info: If you need support for this method, please open a GitHub Issue.');
				break;
		}
		pendingRequest = pendingRequest.query(request.qs);

		if (request._formData != null) {
			pendingRequest = pendingRequest.send(request._formData);
		}
		if (request._maxRedirects != null) {
			pendingRequest = pendingRequest.redirects(request._maxRedirects);
		}
		if (request._timeout != null) {
			pendingRequest = pendingRequest.timeout(request._timeout);
		}
		if (request._data != null) {
			pendingRequest = pendingRequest.send(request._data);
		}
		if (request.headers != null) {
			pendingRequest = pendingRequest.set(request.headers);
		}
		if (request._id != null) {
			console.log('This Shoud NOT HAPPEN!');
			delete request._id;
		}
		//console.log('FET', JSON.stringify(request));
		request._id = hashRequest(request);
		j++;
		if (req.isojs.fetchedData[request._id] == null) {
			pendingRequest.end(function(superErr, superRes) {
				req.isojs.fetchedData[request._id] = {
					err: superErr,
					res: superRes
				};
				j--;
				if (j < 1) {
					done(req, res, next);
				}
			});
		} else {
			if (j < 1) {
				done(req, res, next);
			}
		}
	}
	if (j < 1) {
		done(req, res, next);
	}
	req.isojs.timetrace.push({
		time: Date.now(),
		text: 'fetchInitialized'
	});
};

var loadStates = function() {
	var exportStateCache = [];
	var len = interns.cache.stateComponents.length;
	for (var i = 0; i < len; i++) {
		var component = interns.cache.stateComponents.pop();
		exportStateCache.push(component.state);
	}
	return exportStateCache;
};

var initializeCache = function(req) {
	interns.cache.requests = [];
	interns.cache.unifyedRoute = req.isojs.unifyedRoute;
	interns.cache.fetchedData = req.isojs.fetchedData;
	interns.cache.state = req.isojs.state;
	interns.cache.req = req;
	interns.cache.stateComponents = [];
	interns.cache.cacheComplete = true;
};

var replaceValueInRequest = function(requestPattern, value, valueName) {
	var inUrl = false;
	if (requestPattern.req.url.search(value) >= 0) {
		var inUrl = true;
		var reg = new RegExp(value, 'g');
		requestPattern.req.url = requestPattern.req.url.replace(reg, ':' + valueName);
		requestPattern.replacements.push({
			type: 'str',
			obj: 'url',
			key: valueName
		});
	}
	var objects = ['qs', '_formData', '_maxRedirects', '_timeout', '_data', 'headers'];
	for (var j in objects) {
		var val = objects[j];
		if (requestPattern.req[val] != null) {
			for (var i in requestPattern.req[val]) {
				if (requestPattern.req[val][i] + '' === value + '') {
					requestPattern.replacements.push({
						type: 'obj',
						obj: val + '.' + i,
						key: valueName
					});
				}
			}
		}
	}
	return requestPattern;
};

var setNewTransmission = function() {
	var transmission = [];
	for (var i in interns.cache.requests) {
		var requestPattern = {
			req: interns.cache.requests[i],
			replacements: []
		};
		delete requestPattern.req._id;
		for (var j in interns.cache.state.params) {
			requestPattern = replaceValueInRequest(requestPattern, interns.cache.state.params[j], 'params.' + j);
		}
		for (var j in interns.cache.state.query) {
			requestPattern = replaceValueInRequest(requestPattern, interns.cache.state.query[j], 'query.' + j);
		}
		transmission.push(requestPattern);
	}
	if (transmission.length > 0) {
		interns.transmissions[interns.cache.unifyedRoute] = transmission;
	}
};

var applyTransmission = function(state, req, replacements) {
	//console.log("APTRA", state, req, replacements);
	for (var i in replacements) {
		var replacement = replacements[i];
		var keys = replacement.key.split('.');
		if (keys.length > 1 && state[keys[0]] != null && state[keys[0]][keys[1]] != null) {
			var value = state[keys[0]][keys[1]];
			if (replacement.type === 'str') {
				var reg = new RegExp(':' + replacement.key, 'g');
				req[replacement.obj] = req[replacement.obj].replace(reg, value);
			}
			if (replacement.type === 'obj') {
				var objPath = replacement.obj.split('.');
				if (objPath.length > 1) {
					if (req[objPath[0]] == null) {
						req[objPath[0]] = {};
					}
					req[objPath[0]][objPath[1]] = value;
				} else {
					console.error('Failed to apply obj transmission');
				}
			}
		} else {
			console.error('Failed to apply transmission');
		}
	}
	return req;
};

var hashCode = function(e) {
	try {
		var r = 0;
		var l = e.length;
		for (var i = 0; i < l; i++) {
			r = (r << 5) - r + e.charCodeAt(i);
			r &= r;
		}
		return r;
	} catch (e) {}
};

var superagentPlugin = function(request) {
	if (checkLocation.isServer()) {
		request.end = function(fn) {
			if (checkLocation.isClient()) {
				request.end(fn);
			} else {
				var parsedUrl = url.parse(request.url);
				var minReq = {
					url: parsedUrl.pathname,
					method: request.method,
					qs: request.qs
				};
				if (request._formData != null) {
					minReq._formData = request._formData;
				}
				if (request._maxRedirects !== 5) {
					minReq._maxRedirects = request._maxRedirects;
				}
				if (request._timeout != null) {
					minReq._timeout = request._timeout;
				}
				if (request._data != null) {
					minReq._data = request._data;
				}
				if (request.req != null) {
					if (request.req._headers != null && request.req._headerNames != null) {
						minReq.headers = {};
						for (var i in request.req._headers) {
							minReq.headers[request.req._headerNames[i]] = request.req._headers[i];
						}
					}
				}
				//console.log('SAP', JSON.stringify(minReq));
				minReq._id = hashRequest(minReq);

				var wasCached = false;
				if (interns.cache.fetchedData[minReq._id]) {
					wasCached = true;
				} else {
					interns.cache.cacheComplete = false;
				}

				interns.cache.requests.push(minReq);
				if (this && this.req) {
					this.abort();
				}
				if (interns.cache.fetchedData[minReq._id]) {
					var data = interns.cache.fetchedData[minReq._id];
					fn(data.err, data.res);
				}
			}
		};
	}
	return request;

};

var hashRequest = function(req) {
	var hash = '#' + hashCode(JSON.stringify(req)) + '#'
		//console.log(hash);
	return hash;
}

var noop = function() {};


var loadMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			this.componentDidMount();
		}
	}
};

var stateMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			interns.cache.stateComponents.push(this);
		}
	},
	getInitialState: function() {
		//console.log('getInitialState mixin', typeof window);
		if (typeof globalStateCache !== 'undefined' && globalStateCache.states && globalStateCache.states.length > 0) {
			var state = globalStateCache.states.pop();
			//console.log('globalStateCache found', globalStateCache);
			return state;
		} else {
			//console.log('globalStateCache NOT found');
			return this.isojsInitialState(arguments);
		}
	}
};

var m = {
	superagentPlugin: superagentPlugin,
	loadMixin: loadMixin,
	stateMixin: stateMixin,
	createServer: createServer,
	checkLocation: checkLocation
};


module.exports = m;
