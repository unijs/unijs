var hashObject = function(req) {
	var hash = '#' + hashCode(JSON.stringify(req)) + '#'
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

module.exports = {
	request: hashObject,
	text: hashCode
};
