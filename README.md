# isoJS
Renders [ReactJS](https://github.com/facebook/react) apps isomorphic on [node.js](https://github.com/joyent/node).

isojs renders [ReactJS](https://github.com/facebook/react) apps isomorphic on the server and the client without changing something in the app.

##Most important features:
- **render [React](https://github.com/facebook/react) apps with async api calls isomorphic on node.js**
- **free choice of [Flux](https://github.com/facebook/flux) implementation (or just [React](https://github.com/facebook/react))**
- **no need to define data fetching on serverside**
- **sync state from server rendered app to client**

###What it does:
- guesses which data needs to get fetched on the server based on the [react-router](https://github.com/rackt/react-router) route and previous requests
- fetches all data at the same time
- renders the [React](https://github.com/facebook/react) app and synchronous respond to [superagent](https://github.com/visionmedia/superagent) requests with the data fetched before
- sends the rendered app including the latest state of each component back to the client
- runs your [React](https://github.com/facebook/react) app on the client (if javascript is enabled)


###How looks a classic architecture?
- You build a [React](https://github.com/facebook/react) app
- You load your data via [superagent](https://github.com/visionmedia/superagent)
- You build a REST API-Server for your data loading (no need to be node.js)
- You create an isoJS-Server which handles all front-facing requests

##Get Started:

To get startet just fork the [isojs-demo-app](https://github.com/dustin-H/isojs-demo).

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

With this config you can use the app-builder to create a new server and use it in your express app. (needs to be root!). To ensure, that the server-side part of isojs is available, call `setServer()`.

```js
isojs.checkLocation.setServer();
var isoJSapp = isojs.appBuilder(config);
app.use(isoJSapp());
```

###Client:

A basic component that loads data and holds state looks like that:

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

##What changed compared to a default ReactJS app?
- Use the `isojs.loadMixin` mixin in all data loading components
- Use the `isojs.stateMixin` mixin in all components using state
- Use [superagent](https://github.com/visionmedia/superagent) to load your data
- Use the `isojs.superagentPlugin` plugin to enable isomorphic rendering of this request

##Performance Note:
To be able to render your app as fast as possible try to map your route params to your api calls. Do not convert them in any way.

###Do:
`:id` and `:time` are placeholders for some kind of id and a timestamp

React-Router URL | API Calls
 --- | ---
/blog/:id | /loadpost/:id
/blog?id=:id | /loadpost/:id
/blog/:id | /loadpost?id=:id
/blog/:id?time=:time | /loadpost?id=id&time=:time

###Do NOT !!!!:
React-Router URL | API Calls
 --- | ---
/blog/:id/:time | /loadpost/:id/[:time/2]

`[:time/2]` intents to describe the calculated half of `:time`



[Apache License Version 2.0](LICENSE)
