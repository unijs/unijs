var checkLocation = require('./checkLocation.js');
var isoJsLog = require('./isoJsLog.js');
var requireNodeJsOnly = require;

var isojs = require('./isojs.js');

var express, fs, exec, events, emitter;

var interns = {
	config: {
		getApiServerAddress: function() {
			return 'http://localhost/';
		},
		routesPath: './Route.js',
		uglify: false,
		debug: false,
		head: '<title>isoJS</title>',
		maxRuns: 5
	},
	configRequierements: ['routesPath'],
	buildState: 0,
	routes: {},
	middleware: function(req, res, next) {
		res.send('isoJS Error: No middleware defined! See log!');
	}
};

checkLocation.on('setServer', function() {
	express = requireNodeJsOnly('express');
	fs = requireNodeJsOnly('fs-extra');
	exec = requireNodeJsOnly('child_process').exec;
	events = requireNodeJsOnly('events');
	emitter = new events.EventEmitter();
	requireNodeJsOnly("node-jsx").install({
		extension: ".js"
	});
});

var appBuilder = function(config) {
	checkLocation.setServer();
	isoJsLog.log('Initializing app...');
	if (config == null && interns.configRequierements.length > 0) {
		return isoJsLog.error('(appBuilder): Expected an config object!');
	}
	for (var i in interns.configRequierements) {
		if (config[interns.configRequierements[i]] == null) {
			return isoJsLog.error('(appBuilder): The config option [' + interns.configRequierements[i] + '] is required!');
		}
	}
	for (var i in config) {
		if (interns.config[i] == null) {
			interns.config[i] = config[i];
		} else {
			if (typeof interns.config[i] === typeof config[i]) {
				interns.config[i] = config[i];
			} else {
				return isoJsLog.error('(appBuilder): The config option [' + i + '] needs to be typeof [' + (typeof interns.config[i]) + ']. You passed a [' + (typeof config[i]) + ']');
			}
		}
	}
	isoJsLog.log('1. Load routes file...');
	try {
		var directPath = process.cwd() + '/' + interns.config.routesPath;
		interns.routes = requireNodeJsOnly(directPath);
	} catch (err) {
		isoJsLog.error('(appBuilder): Could not load routes from "' + directPath + '"!');
		return console.error(err);
	}
	config.routes = interns.routes;
	interns.middleware = isojs.createServer(config);

	if (interns.middleware == null) {
		return isoJsLog.error('(appBuilder): Could not create isojs server!');
	}

	var appText = "var isojs = require('isojs'); isojs.checkLocation.setClient(); var React = require('react'); var Router = require('react-router'); var routes = require('" + directPath + "'); Router.run(routes, Router.HistoryLocation, function (Handler) { React.render(<Handler/>, document.getElementById('main')); });";

	var appJSpath = __dirname + '/../build/app.js';
	var srcPath = __dirname + '';
	var buildPath = __dirname + '/../build';

	fs.outputFile(appJSpath, appText, function(err) {
		if (err) {
			return isoJsLog.error('(appBuilder): Failed to create build dir: "' + appJSpath + '"!', err);
		}

		isoJsLog.log('2. Build browserify bundle...');

		exec('node builder.js ' + buildPath, {
			cwd: srcPath
		}, function(error, stdout, stderr) {
			if (error) {
				isoJsLog.error('(appBuilder): Failed to build browserify bundle...')
				console.error(error)
				return console.error(stderr);
			}
			interns.buildState++;
			emitter.emit('renderState1');
			if (interns.config.uglify) {
				isoJsLog.log('APP Ready! :) [bundle not minifyed]');
				isoJsLog.log('3. Build minifyed bundle...');
				exec('node minify.js ' + buildPath, {
					cwd: srcPath
				}, function(error, stdout, stderr) {
					if (error) {
						return isoJsLog.error('(appBuilder): Failed to build browserify bundle...');
					}
					interns.buildState++;
					emitter.emit('renderState2');
					isoJsLog.log('APP Ready! :) [bundle minifyed]');
				});
			} else {
				isoJsLog.warn('NOTE: Enable config.uglify in production to decrease webapp size.');
				isoJsLog.log('APP Ready! :)');
			}
		});
	});

	return render;
};

var render = function() {

	var app = express();

	app.use(function(req, res, next) {
		if (interns.buildState < 1) {
			emitter.once('renderState1', next);
			//res.status(503).send('<font family="Arial"><h1>ERROR: 503 Service Unavailable</h1><br><h4>The isoJS server is still building the webapp. Try again in a about a minute.</h4></font>');
		} else {
			next();
		}
	});

	app.use('/bundle.min.js', function(req, res, next) {
		var file = "bundle.js";
		if (interns.buildState > 1) {
			file = "bundle.min.js";
		}

		fs.readFile(__dirname + '/../build/' + file, function(err, data) {
			if (err) {
				res.writeHead(404);
				return res.end("File not found.");
			}
			res.setHeader("Content-Type", "application/javascript");
			res.writeHead(200);
			res.end(data);
		});
	});

	app.use(function(req, res, next){
		interns.middleware(req, res, next);
	});
	return app;
};

module.exports = {
	build: appBuilder
};
