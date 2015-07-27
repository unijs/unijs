# Tutorial - NOT FINISHED - DON'T USE!!!
For this Getting Started Guide we will use [UniJS](/unijs/unijs), [UniJS-builder](/unijs/unijs-builder) and [react-router](/rackt/react-router).

## 1. Let's create a simple React App
The app will show a list of available posts and one Post

**We need a Route file.**

```js
import {Route, DefaultRoute} from 'react-router'
import Main from './Main.react'
import SinglePost from './SinglePost.react'
import Home from './Home.react'

var routes = (
    <Route handler="Main" name="main" path="/">
         <Route handler={SinglePost} name="post" path="/:id"/>
         <DefaultRoute handler={Home} name="home" />
    </Route>
);

export routes;
```

**The Main Component is a wrapper for the other Components.**

```js
import React from 'react'
import Post from './Post.react';

class SinglePost extends React.Component {
    render() {
        return (
            <Post id={this.context.router.getCurrentParams().id}/>
        );
    }
}

SinglePost.contextTypes = {
    router: React.PropTypes.func
};

export Main;
```

**Then a React Component for handling the post and it's Route-Params.**

```js
import React from 'react'
import Post from './Post.react';

class SinglePost extends React.Component {
    render() {
        return (
            <Post id={this.context.router.getCurrentParams().id}/>
        );
    }
}

SinglePost.contextTypes = {
    router: React.PropTypes.func
};

export SinglePost;
```

**Another Component that loads data and shows it.**

```js
import React from 'react';
var superagent = require('superagent');
var unijs = require('unijs');

class Post extends React.Component {
   constructor() {
        super();
      // Define you initial state in constructor
        this.state = {
            title: '',
            content: ''
        };
    }

   // A function to load posts from the REST-API
    loadBlogPost(id) {
        superagent.get('/api/getpost/' + id)
        .use(unijs.superagentPlugin)
        .end(function(err, res) {
         // Very simple error handling
            if (err) {
                return alert('Failed to load post!');
            }
            this.setState(JSON.parse(res.text));
        }.bind(this));
    }

   // Load the post when componentDidMount
    componentDidMount() {
        this.loadBlogPost(this.props.id);
    }

   // Reload the post, when the id has changed
    componentWillReceiveProps(nextProps) {
        if (nextProps.id != this.props.id) {
            this.loadBlogPost(nextProps.id);
        }
    }

   // Simple UI
    render() {
        return (
            <div style={{'textAlign': 'justify'}}>
                <h1>{this.state.title}</h1>
                <br/><br/>
                <span>{this.state.content}</span>
            </div>
        );
    }
}

// Call UniJS.Extend to make it work
Blog = unijs.extend(Blog);

export Post;
```
