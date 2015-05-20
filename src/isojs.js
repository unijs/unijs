
var workData = require('./workData.js');
var isoJsMiddleware = require('./isoJsMiddleware.js');
var isoJsLog = require('./isoJsLog.js');
var checkLocation = require('./checkLocation.js');
// config.routes config.bundleFile config.head config.maxRuns config.debug config.getApiServerAddress
var createServer = function(config){
	checkLocation.setServer();
	if(validateConfig(config) === true){
		return isoJsMiddleware;
	} else {
		return isoJsLog.error('(createServer): Failed to createServer because of invalid config parameter!');
	}
};

var validateConfig = function(config){
	//isoJsLog.log('Initializing app...');
	if (config == null && workData.configRequierements.length > 0) {
		return isoJsLog.error('(validateConfig): Expected an config object!');
	}
	for (var i in workData.configRequierements) {
		if (config[workData.configRequierements[i]] == null) {
			return isoJsLog.error('(validateConfig): The config option [' + workData.configRequierements[i] + '] is required!');
		}
	}
	for (var i in config) {
		if (workData.config[i] == null) {
			workData.config[i] = config[i];
		} else {
			if (typeof workData.config[i] === typeof config[i]) {
				workData.config[i] = config[i];
			} else {
				return isoJsLog.error('(validateConfig): The config option [' + i + '] needs to be typeof [' + (typeof workData.config[i]) + ']. You passed a [' + (typeof config[i]) + ']');
			}
		}
	}
	return true;
}

module.exports = {
	createServer: createServer
};
