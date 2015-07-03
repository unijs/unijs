var React = require('react');
var isojs = require('isojs');
var styles = require('./index.css.js');

var Style = isojs.ObsceneStyle.load(styles);
Style.addStyleSheet('//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
var S = Style.load();

class Counter extends React.Component {
	render() {
		return (
			<div className={S('box')} onClick={this.tick.bind(this)}>
				Clicks: {this.state.count}
			</div>
		);
	}
}
