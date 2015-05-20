var workData = require('./workData.js');

var send = function(req, res, next) {
	res.send('<!doctype html><html lang="en"><head><meta charset="utf-8">' +
		workData.config.head +
		'</head>' +
		'<body><div id="main">' + req.isojs.reactHtml + '</div></body>' +
		'<script>var globalStateCache = ' +
		JSON.stringify(req.isojs.reactState) +
		'</script>' +
		'<script src="/bundle.min.js"></script></html>');
};

module.exports = {
	send: send
};
