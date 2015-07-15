var checkLocation = require('../utils/checkLocation.js');
var renderCache = require('../render/cache.js');

var extend = function(Component, noFetch) {
	if (noFetch == null || typeof noFetch !== 'boolean') {
		noFetch = false;
	}
	class Export extends Component {
		constructor(...args) {
			var ret = super(...args);
			if (this.state) {
				if (checkLocation.isClient()) {
					this.state = state = unijsGlobalStateCache.states.pop();
				} else {
					renderCache.stateComponents.push(this);
				}
			}
			return ret;
		}
		componentWillMount(...args) {
         var ret = null;
			if (super.componentWillMount) {
				ret = super.componentWillMount(...args);
			}
			if (checkLocation.isServer() && noFetch === false) {
				if (this.unijsFetchData) {
					this.unijsFetchData();
				} else {
					this.componentDidMount();
				}
			}
			return ret;
		}
	}

	return Export;
}

module.exports = extend;
