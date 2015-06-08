var checkLocation = require('./checkLocation.js');
var renderCache = require('./renderCache.js');

var loadMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			if (this.isojsFetchData) {
				this.isojsFetchData();
			} else {
				this.componentDidMount();
			}
		}
	}
};

var stateMixin = {
	componentWillMount: function() {
		if (checkLocation.isServer()) {
			renderCache.stateComponents.push(this);
		}
	},
	getInitialState: function() {
		if (typeof isojsGlobalStateCache !== 'undefined' && isojsGlobalStateCache.states && isojsGlobalStateCache.states.length > 0) {
			var state = isojsGlobalStateCache.states.pop();
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