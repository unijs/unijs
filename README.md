
# <img src="https://avatars0.githubusercontent.com/u/13003405?v=3&s=100" height="50" style="position: relative; top: -5px;" alt=""> UniJS

UniJS is a library for rendering [ReactJS](https://github.com/facebook/react) apps on [node.js](https://github.com/joyent/node).

* **Universal:** Use the same code base for server- and client-rendering. Also there is no force to use flux.
* **Autofetch Data:** Don't worry about data fetching on your server. Just provide a REST-API somewhere and perform AJAX-Requests. UniJS automatically detects which data is neccessary for rendering and fetches it before render.
* **State Sync:** Sync's the server rendered state to the client. After rendering the app UniJS takes the state out of all components and responds them with the HTML to the client. There the state gets pushed back to the components as initial state.
* **EcmaScript 6:** Build your apps in ES6 style. 

<br>
> *UniJS requires to use [react-router](https://github.com/rackt/react-router).*


<!--## Demo + Docu
* **Live:** [UniJS on Heroku](https://unijs.herokuapp.com/)<br>
 (it's free account so it may takes some time when the app sleeps)
* **Repo:** [unijs/unijs-demo](https://github.com/unijs/unijs-demo)-->

## [Documentation](./docs/Index.md)

##Quick Start

```sh
git clone https://github.com/unijs/demo.git
cd demo
npm install
npm start
```

##Usage

###Installation

```sh
npm install unijs
```

###Server

On server-side you need to define your react-router Routes by setting the Router. With the resources attribute array you can add `js` and `css` files.

```js
var unijs = require('unijs');
var Router = require('client/js/Routes.js');

app.use(Server.getMiddleware());
// Here express is used. You can also use something similar, that passes (req, res, next) to the returned function on each request.

var Server = unijs.Server();

var myApp = new Server.App('myApp');

myApp.Router = Router;
myApp.resources.push(__dirname+'/bundle.js');

Server.mount('/', myApp);
```

####Main client render file for bundle
>Your React App in the bundle file needs to render to `#main` div container.

```js
var React = require('react');
var Router = require('react-router');
var routes = require('/path/to/Routes.js');
window.onload = function() {
	Router.run(routes, Router.HistoryLocation, function(Handler) {
		React.render(<Handler/>, document.getElementById('main'));
	});
};
```

####UniJS-builder
UniJS-builder simplifies the usage of UniJS. By defining the path of your Routes file it compiles with babel, browserify and uglifyify. Then it adds the bundle to the resources.

```js
var unijs = require('unijs');
var App = unijsBuilder.extend(Server.App);

var Server = unijs.Server();

app.use(Server.getMiddleware());
// Here express is used. You can also use something similar, that passes (req, res, next) to the returned function on each request.

var unijsApp = new App('myDemoApp');

unijsApp.routesPath = 'client/js/Routes.js';

Server.mount('/', unijsApp);
```

###Client

On client you need to extend each component that has state or is loading data with AJAX.

```js
class Blog extends React.Component{
	// component methods
}

Blog = unijs.extend(Blog);
```

And load your data with superagent plus unijs-plugin in the componentDidMount method. (componentDidMount gets called while server-rendering when componentWillMount gets called)

```js
class Blog extends React.Component{
	componentDidMount(){
		superagent.get('/getdata')
			.use(unijs.superagentPlugin)
			.end(function(err, res) {
				this.setState(JSON.parse(res.text));
			}.bind(this)
		);
	}
}
```

Define your initial state as you do it in React ES6:

```js
class Blog extends React.Component{
	constructor(){
		super();
		this.state = {title: '', content: ''};
	}
}
```

Now put it all together with some ReactJS basics...

```js
var React = require('react');
var superagent = require('superagent');
var unijs = require('unijs');

class Blog extends React.Component {
	constructor() {
		super();
		this.state = {title: '', content: ''};
	}
	componentDidMount() {
		superagent.get('/blog/getpost/' + this.props.id)
			.use(unijs.superagentPlugin)
			.end(function(err, res) {
				this.setState(JSON.parse(res.text));
			}.bind(this)
		);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.id != this.props.id) {
			this.loadBlogPost(nextProps.id);
		}
	}
	render() {
		return (
			<div>
				<h1>{this.state.title}</h1>
				<div>{this.state.content}</div>
			</div>
		);
	}
}
Blog = unijs.extend(Blog);

module.exports = Blog;
```

###Contribution and Ideas are Welcome! ;-)
Ideally just create a GitHub Issue or may even a PullRequest to discuss.

[MIT](LICENSE)
