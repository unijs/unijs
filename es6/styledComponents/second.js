var React = require('react');
var isojs = require('isojs');
var styles = require('./index.css.js');

var Style = isojs.ObsceneStyle.load(styles);
Style.addStyleSheet('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');

class Counter extends React.Component {
	render() {
		return (
			<div className={this.s['box'])} onClick={this.tick.bind(this)}>
				Clicks: {this.state.count}
			</div>
		);
	}
}

Couter = Style.extend(Couter);
