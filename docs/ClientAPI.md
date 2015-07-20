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

## Check Location
With this feature you can detect wether the running render process runs on browser or on server. There are different functions available:

### `unijs.checkLocation.isClient()`
Returns true or false. What it does should be clear.

### `unijs.checkLocation.isServer()`
Returns true or false. What it does should be clear.
