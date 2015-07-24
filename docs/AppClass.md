# App Class
With this ES6/Prototype class you can create a new app which can be mounted to your Server. The Server can mount multiple apps.

```js
var myApp = new Server.App('myApp');
```

The instance `myApp` has this methods and attributes:

### `constructor(name [, resources = []  ])`
You have to pass a (in your project scope) unique app name and can optionally define resources. More info about resources below.

### `Router = null`
Expects to be set to an [react-router](https://github.com/rackt/react-router) routes object.

### `getApiUrl(req, res, next)`
- **What is this?** <br>In your client app you perform a AJAX request e.g. to `'/get/posts'`. The UniJS Server needs to fire this request also. So the URL to your server is necessary.

This function gets called when UniJS needs the API URL. It needs to return an URL. By default it is defined by this function:

```js
getApiUrl(req, res, next) {
   var protocol = 'http';
   var host = 'localhost';
   var path = '/';
   if (req.protocol != null && typeof req.protocol === 'string' && (req.protocol === 'http' || req.protocol === 'https')) {
      protocol = req.protocol;
   }
   if (req.headers != null && req.headers.host != null && typeof req.headers.host === 'string' && req.headers.host !== '') {
      host = req.headers.host;
   }
   if (req.path != null && typeof req.path === 'string' && req.path !== '') {
      path = req.path;
   }
   return protocol + '://' + host + path;
}
```

You can overwrite it when you need another behavior. For example if you load your data from another server.

### `head = []`
An array of `strings` which will be added to the HTML-Header of the rendered output.

**Examples:**
```js
myApp.head = ['<link rel="stylesheet" type="text/css" href="style.css" />'];
myApp.head.push('<title>MyApp</title>');
```

### `body = []`
An array of `strings` which will be added to the HTML-Body of the rendered output.

**Examples:**
```js
myApp.body = ['<div>Some Content</div>'];
myApp.body.push('<span>Some Span Text</span>');
```

### `resources = []`
An array of `strings` (paths) to resources like `js` or `css` files. UniJS will host these files and add them to the HTTP-Header of the rendered output.

**Examples:**
```js
myApp.resources = ['/path/to/style.css', '/path/to/script.js'];
myApp.resources.push('/path/to/another/script.js');
```

### `charset = 'utf-8'`
You can overwrite charset to change it.

**Example:**
```js
myApp.charset = 'utf-16';
```
