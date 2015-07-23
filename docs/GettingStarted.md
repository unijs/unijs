# Getting Started - NOT FINISHED - DON'T USE!!!
For this Getting Started Guide we will use [UniJS](unijs/unijs), [UniJS-builder](unijs/unijs-builder) and [react-router](rackt/react-router).

## 1. Let's create a simple React App

**We need a Route file.**

```js
import {Route, DefaultRoute} from 'react-router'
import PostWrapper from './PostWrapper.react'

var routes = (
    <Route name="main" path="/">
         <Route handler={Post} name="post" path="/:id"/>
    </Route>
);

export routes;
```

**Then a React Component for handling the post and it's Route-Params.**
```js
import Post from './Post.react';

class PostWrapper extends React.Component {
	render() {
		return (
			<Blog id={this.context.router.getCurrentParams().id}/>
		);
	}
}

PostWrapper.contextTypes = {
	router: React.PropTypes.func
};

export PostWrapper;
```

**Then a React Component for handling the post and it's Route-Params.**
```js
import Post from './Post.react';

class PostWrapper extends React.Component {
	render() {
		return (
			<Blog id={this.context.router.getCurrentParams().id}/>
		);
	}
}

PostWrapper.contextTypes = {
	router: React.PropTypes.func
};

export PostWrapper;
```
