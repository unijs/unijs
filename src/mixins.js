
var checkLocation = require('./checkLocation.js');
var workData = require('./workData.js');

var loadMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			this.componentDidMount();
		}
	}
};

var stateMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			workData.cache.stateComponents.push(this);
		}
	},
	getInitialState: function() {
		if (typeof globalStateCache !== 'undefined' && globalStateCache.states && globalStateCache.states.length > 0) {
			var state = globalStateCache.states.pop();
			return state;
		} else {
			return this.isojsInitialState(arguments);
		}
	}
};

module.exports = {
	stateMixin: stateMixin,
	loadMixin: loadMixin
};
