'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var checkLocation = require('./checkLocation.js');
var renderCache = require('./renderCache.js');

var React = require('react');

var es6Class = (function (_React$Component) {
	function es6Class(obj) {
		_classCallCheck(this, es6Class);

		_get(Object.getPrototypeOf(es6Class.prototype), 'constructor', this).call(this);
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

	_inherits(es6Class, _React$Component);

	_createClass(es6Class, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
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
	}]);

	return es6Class;
})(React.Component);

module.exports = es6Class;