'use strict';

var superagent = require('superagent');
var hashObject = require('../utils/hash.js').object;
var uniJsLog = require('../utils/log.js');
var url = require('url');

var sendApiRequest = function sendApiRequest(req, request, done) {
	var reqUrl = url.resolve(req.unijs.app._apiUrl, request.url);
	var pendingRequest = superagent;
	switch (request.method.toUpperCase()) {
		case 'GET':
			pendingRequest = pendingRequest.get(reqUrl);
			break;
		case 'POST':
			pendingRequest = pendingRequest.post(reqUrl);
			break;
		default:
			uniJslog.warn('Not supported request method! (' + request.method + ') uniJs Info: If you need support for this method, please open a GitHub Issue.');
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
		uniJslog.error('(fetchDataThis): request._id !== null => Shoud NOT HAPPEN! Please create a GitHub issue.');
		delete request._id;
	}

	var arr = [].concat(req.unijs.options.forwardHeaders);
	if (req.headers['unijs-forward-headers'] != null) {
		try {
			var forwardHeaders = JSON.parse(req.headers['unijs-forward-headers']);
			arr = arr.concat(forwardHeaders);
		} catch (e) {
			uniJsLog.error('Invalid forward header!');
			console.error('> ', e);
		}
	}
	for (var i in arr) {
		if (req.headers[arr[i]] != null) {
			pendingRequest = pendingRequest.set(arr[i], req.headers[arr[i]]);
		}
	}

	request._id = hashObject(request);
	if (req.unijs.fetchedData[request._id] == null) {
		pendingRequest.end(function (superErr, superRes) {
			req.unijs.fetchedData[request._id] = {
				err: superErr,
				res: superRes
			};
			done(req, request);
		});
	} else {
		done(req, request);
	}
};
module.exports = sendApiRequest;