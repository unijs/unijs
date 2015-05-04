# isojs
Renders reactJS apps isomorphic on node.js without big app changes.

isojs aims to render ReactJS apps isomorphic on the server and the client without changing something in the app and without defining which data needed to be fetched on server.

However this seems to be not possible for now.

##Features:
- supports nearly all flux implementations or just react (your free choice)
- autodetects which data needs to get fetched on the server
- you really only need to code a react app and data API's

##Okey but what's the catch?
- Initial data needs to be fetched via a superagent plugin.
- Data loading components need to load a given mixin.
- State holding components need to load a given mixin for sync state and rename the getInitialState function.

##Usage

###Installation:

`npm install isojs`

###Server:

On the server-side you only need to define where your routes component is and on which url your data API can be reached.

```js
var isojs = require('isojs');

var config = {
	routesPath: './Routes.js',
	getApiServerAddress: function(){
		return 'http://localhost:8080/';
	}
};
```

With this config you can create a new server and use it in your express app. (needs to be root!)

```js
var isoJSapp = isojs.createServer(config);
app.use(isoJSapp());
```

###Client:

A component which loads data and holds state looks like that:

```js
var React = require('react');
var superagent = require('superagent');
var isojs = require('isojs');

var Blog = React.createClass({
	mixins: [isojs.loadMixin, isojs.stateMixin],

	isojsInitialState: function(){
		return { title: '', content: '' };
	},

	loadBlogPost: function(id){
		superagent
		.get('/blog/getpost/'+id)
		.use(isojs.superagentPlugin)
		.end(function(err, res){
			if(err){
				return this.setState({ title: '404 ERROR', content: 'Could not find Post!' });;
				return console.error('FAIL', err);
			}
			this.setState(JSON.parse(res.text));
		}.bind(this));
	},

	componentDidMount: function(){
		this.loadBlogPost(this.props.id);
	},

	render: function() {
		return (
			<div>
				<h1>{this.state.title}</h1>
				<div>{this.state.content}</div>
			</div>
		);
	}
});

```

The `Routes.js` file defines all routes of your app with react-router.

```js
var React = require('react');
var Route = require('react-router').Route;

var BlogPost = require('./components/BlogPost.react');

var routes = (
	<Route name="main" path="/">
		<Route path="/blogpost/:id" name="blogpost" handler={BlogPost}/>
	</Route>
);

module.exports = routes;
```

( ** *code and readme update coming soon!* ** )

[Apache License Version 2.0](LICENSE)
