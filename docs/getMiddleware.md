# `getMiddleware(options)`
This function gets used once in your application to get the UniJS Middleware.

You pass an options object which can contain the following keys:

Name    | Type
:------ | :------
debug   | boolean
maxRuns | number

Enable debug to get a more detailed logging. `(Default: false)`

MaxRuns defines how often UniJS is allowed to run `React.renderToString()` per request. `(Default: 5)`

## `middleware(req, res, next)`
Middleware is a function which has 3 parameters. These are the same parameters that are used in [ExpressJS](https://github.com/strongloop/express) middleware.

If you are using express you can just use it.

**Example:**
```js
var options {
   debug: false,
   maxRuns: 5
}
app.use(Server.getMiddleware(options))
```
