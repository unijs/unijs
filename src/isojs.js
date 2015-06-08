var workData = require('./workData.js');
var isoJsMiddleware = require('./isoJsMiddleware.js');
var isoJsLog = require('./isoJsLog.js');
var checkLocation = require('./checkLocation.js');
// config.routes config.bundleFile config.head config.maxRuns config.debug config.getApiServerAddress
var createServer = function(config) {
	checkLocation.setServer();
	var wd = validateConfig(config);
	if (wd && typeof wd === 'object' && wd.config) {
		return isoJsMiddleware(wd.config);
	} else {
		return isoJsLog.error('(createServer): Failed to createServer because of invalid config parameter!');
	}
};

var validateConfig = function(config) {
	//isoJsLog.log('Initializing app...');
	var wd = JSON.parse(JSON.stringify(workData));
	if (config == null && wd.configRequierements.length > 0) {
		return isoJsLog.error('(validateConfig): Expected an config object!');
	}
	for (var i in wd.configRequierements) {
		if (config[wd.configRequierements[i]] == null) {
			return isoJsLog.error('(validateConfig): The config option [' + wd.configRequierements[i] + '] is required!');
		}
	}
	for (var i in config) {
		if (wd.config[i] == null) {
			wd.config[i] = config[i];
		} else {
			if (typeof wd.config[i] === typeof config[i]) {
				wd.config[i] = config[i];
			} else {
				return isoJsLog.error('(validateConfig): The config option [' + i + '] needs to be typeof [' + (typeof wd.config[i]) + ']. You passed a [' + (typeof config[i]) + ']');
			}
		}
	}
	return wd;
}

module.exports = {
	createServer: createServer
};