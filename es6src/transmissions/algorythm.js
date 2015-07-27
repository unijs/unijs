
var transmissionStore = require('../transmissions/store.js');
var renderCache = require('../render/cache.js');
var hashObject = require('../utils/hash.js').object;

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

var setNewTransmission = function(done) {
	var transmission = {};
	var saveOnEnd = false;
	for (var i in renderCache.requests) {
		var requestPattern = {
			req: renderCache.requests[i],
			replacements: []
		};
		delete requestPattern.req._id;
		for (var j in renderCache.state.params) {
			requestPattern = replaceValueInRequest(requestPattern, renderCache.state.params[j], 'params.' + j);
		}
		for (var j in renderCache.state.query) {
			requestPattern = replaceValueInRequest(requestPattern, renderCache.state.query[j], 'query.' + j);
		}
		requestPattern._id = hashObject(requestPattern);

		transmission[requestPattern._id] = requestPattern;
		saveOnEnd = true;
	}
	if (saveOnEnd === true) {
		transmissionStore.setTransmission(renderCache.unifyedRoute, transmission, done);
	}
};

module.exports = {
	applyTransmission: applyTransmission,
	setNewTransmission: setNewTransmission
};
