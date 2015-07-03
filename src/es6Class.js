var checkLocation = require('./checkLocation.js');
var renderCache = require('./renderCache.js');

var React = require('react');

class es6Class extends React.Component {
	constructor(obj) {
		super()
		var obj = obj || {};
		if (obj.state != null && obj.state === true) {
			if (typeof isojsGlobalStateCache !== 'undefined' && isojsGlobalStateCache.states && isojsGlobalStateCache.states.length > 0) {
				this.state = isojsGlobalStateCache.states.pop();
				return this.state;
			}
		}
		if (obj.load != null && obj.load === true) {
			this.isojsLoader = true;
		}
	}

	componentWillMount() {
		if (checkLocation.isServer()) {
			if (this.isojsStateSync) {
				renderCache.stateComponents.push(this);
			}
			if (this.isojsLoader) {
				if (this.isojsFetchData) {
					this.isojsFetchData();
				} else {
					this.componentDidMount();
				}
			}
		}
	}
}

module.exports = es6Class;