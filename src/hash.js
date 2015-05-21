
var isoJsLog = require('./isoJsLog.js');

var hashObject = function(obj) {
	var hash = '#' + hashCode(JSON.stringify(obj)) + '#'
		//console.log(hash);
	return hash;
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

var hashRequestWrapper = function(obj) {
	isoJsLog.warn('hash.request is deprecated! Do not use it anymore!');
	return hashObject(obj);
}

module.exports = {
	request: hashRequestWrapper,
	object: hashObject,
	text: hashCode
};
