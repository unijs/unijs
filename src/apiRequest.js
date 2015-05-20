var superagent = require('superagent');
var hashRequest = require('./hash.js').request;
var workData = require('./workData.js');

var sendApiRequest = function(req, request, done) {
	var reqUrl = url.resolve(workData.config.getApiServerAddress(), request.url);
	var pendingRequest = superagent;
	switch (request.method.toUpperCase()) {
		case 'GET':
			pendingRequest = pendingRequest.get(reqUrl);
			break;
		case 'POST':
			pendingRequest = pendingRequest.post(reqUrl);
			break;
		default:
			isoJSlog.warn('Not supported request method! (' + request.method + ') isoJS Info: If you need support for this method, please open a GitHub Issue.');
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
		isoJSlog.error('(fetchDataThis): request._id !== null => Shoud NOT HAPPEN! Please create a GitHub issue.');
		delete request._id;
	}
	request._id = hashRequest(request);
	if (req.isojs.fetchedData[request._id] == null) {
		pendingRequest.end(function(superErr, superRes) {
			req.isojs.fetchedData[request._id] = {
				err: superErr,
				res: superRes
			};
			done(req, request);
		});
	} else {
		done(req, request);
	}
}
