var workData = {
	config: {
		routes: {},
		bundleFile: '/bundle.js',
		head: '<title>isoJS</title>',
		maxRuns: 5,
		debug: false,
		getApiServerAddress: function() {
			return 'http://localhost/'
		}
	},
	cache: {},
	configRequierements: ['routes']
};

module.exports = {};
