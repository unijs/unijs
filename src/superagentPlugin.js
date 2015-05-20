var checkLocation = require('./checkLocation.js');
var workData = require('./workData.js');
var hashRequest = require('./hash.js').request;
var url = require('url');

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

				minReq._id = hashRequest(minReq);
				var wasCached = false;
				if (workData.cache.fetchedData[minReq._id]) {
					wasCached = true;
				} else {
					workData.cache.cacheComplete = false;
				}

				workData.cache.requests.push(minReq);
				if (this && this.req) {
					this.abort();
				}
				if (workData.cache.fetchedData[minReq._id]) {
					var data = workData.cache.fetchedData[minReq._id];
					fn(data.err, data.res);
				}
			}
		};
	}
	return request;

};

module.exports = superagentPlugin;
