# Client API
The Client API is directly in the main `unijs` object. There are following functions available.

Name             | Type
:--------------- | :-------
superagentPlugin | function
extend           | function
checkLocation    | object
render           | object

## Superagent Plugin
Use this plugin for all your AJAX-Superagent-Requests right before you call `.end()`.

```js
superagent.get('/blog/getpostlist')
   .accept('application/json')
   .use(unijs.superagentPlugin)
   .end(function(err, res) {
      /* do something */
   });
```

## Extend
Use this function to extend your React Component Classes which hold state or load async data.

```js
class MyComponent extends React.Component{
   /* some content */
}

MyComponent = unijs.extend(MyComponent);
```

**What does this thing?**
Normally you do your AJAX-Calls in the `componentDidMount` method. However, due to the fact that the component will not be mounted on the server, because there is no DOM, UniJS will catch `componentWillMount` and call `componentDidMount` in your component. When this is a problem for you (which is possible) you can define `unijsFetchData` instead. This will be called on componentWillMount on the server, but not on the client. So you will need to call this method in your `componentDidMount` if you want to fetch the data also on the client.

Another way to stop UniJS from calling `componentDidMount` is to define noFetch in the extend function:

```js
MyComponent = unijs.extend(MyComponent, true);
```

* **NOTE:** If you fetch data from either `componentDidMount` or `unijsFetchData` this call needs to be in sync. So it should't look like this:

```js
// THIS WILL NOT WORK!

componentDidMount(){
   setTimeout(function(){
      superagent.get('/blog/getpostlist')
         .accept('application/json')
         .use(unijs.superagentPlugin)
         .end(function(err, res) {
            /* do something */
         });
   }, 123)
}

// THIS WILL NOT WORK!
```

## Check Location
With this feature you can detect wether the running render process runs on browser or on server. There are different functions available:

### `unijs.checkLocation.isClient()`
Returns true or false. What it does should be clear.

### `unijs.checkLocation.isServer()`
Returns true or false. What it does should be clear.

## Render
Render has for the moment just one property named `cache`. This includes several render information from UniJS which can be useful to create plugins. Read more at [Plugins](Plugins.md)
