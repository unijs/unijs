var interns = {
	cache: {
		unifyedRoute: '',
		requests: [],
		fetchedData: {},
		stateComponents: [],
		cacheComplete: true
	},
	transmissions: {

	},
	config: {
		getApiServerAddress: function() {
			return 'http://localhost/';
		},
		debug: false,
		head: '<title>isoJS</title>',
		maxRuns: 5
	},
	configRequierements: [],
	routes: {}
};
