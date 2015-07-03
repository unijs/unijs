var React = require('react');
var isojs = require('isojs');
var styles = require('./index.css.js');

isojs.addStyleSheet('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');

var S = isojs.Style.load(styles);

class Counter extends isojs.Component {
	constructor(props) {
		super(props);
		this.state = this.state || {
			count: props.initialCount
		};
	}
	tick() {
		this.setState({
			count: this.state.count + 1
		});
	}
	render() {
		return (
			<div className={S('box')} onClick={this.tick.bind(this)}>
				Clicks: {this.state.count}
			</div>
		);
	}
}
