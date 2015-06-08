
var apiRequest = require('./apiRequest.js');
var applyTransmission = require('./transmissionAlgorythm.js').applyTransmission;
var transmissionStore = require('./transmissionStore.js');

var fetchData = function(req, res, next, callback) {
	transmissionStore.getTransmission(req.isojs.unifyedRoute, function(error, transmission) {
		if (error != null) {
			return callback(req, res, next);
		}
		var fetchedData = {};
		var j = 0;
		for (var i in transmission) {
			j++;
			var replacements = transmission[i].replacements;
			var request = JSON.parse(JSON.stringify(transmission[i].req));
			request = applyTransmission(req.isojs.state, request, replacements);

			apiRequest(req, request, function(req, request) {
				j--;
				if (j < 1) {
					callback(req, res, next);
				}
			});
		}
	});
};

module.exports = fetchData;
