# Server API
> The lowercase `unijs` always means this: <br> `var unijs = require('unijs')`

UniJS provides a function called `unijs.Server()`. This returns always the same Server object.
- **Why is this a function and not just an object?** <br>Because UniJS needs to know wether it is running/rendering in NodeJS or in the browser.

## Server Object
The mentioned object has the following props:

Name          | Type
:------------ | :------------------
App           | ES6/Prototype class
getMiddleware | function
mount         | function
unmount       | function

For further easier use lets create a new variable.

```js
var Server = unijs.Server();
```

### [App](AppClass.md)
### [getMiddleware](getMiddleware.md)
### [mount](mount.md#app-lifecycle)
### [unmount](mount.md#unmountidentifyer-callback)
