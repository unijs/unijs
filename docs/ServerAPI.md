# Server API
> The lowercase `unijs` always means this: <br> `var unijs = require('unijs')`

UniJS provides a function called `unijs.Server()`. This returns always the same object.
- **Why is this a function and not just an object?** <br>Because UniJS needs to know weather it is running/rendering in NodeJS or in the browser.

## Server Object
The mentioned object has the following props:

Name              | Type
:---------------- | :------------------
App               | ES6/Prototype class
getRequestHandler | function
mount             | function
unmount           | function

For further easier use lets create a new variable.

```js
var Server = unijs.Server();
```

### [App](AppClass.md)

### [getRequestHandler](getRequestHandler.md)

### [mount](mount.md)

### [unmount](getRequestHandler.md)
