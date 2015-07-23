# App Lifecycle
Each instance of App has lifecycle functions:

## `mount(path, app, callback)`
You can mount an app to the Server on a specific path like `/` or `/app` for example. Each request which begins with the path you defined will be handled by your app.

**Example:**
```js
Server.mount('/', myApp, fucntion(){
   /* do something */
})
```

## `unmount(identifyer, callback)`
To remove your app from the Server you can unmount it. The identifyer is either the path or the app object.

**Examples:**
```js
Server.unmount('/', fucntion(){
   /* do something */
})

Server.unmount(myApp, fucntion(){
   /* do something */
})
```
