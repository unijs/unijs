var App = require('./App.js');
var appControl = require('./appControl.js');
var middleware = require('./middleware.js');
//var cache = require('./render/cache.js');

var m = module.exports = {};

for(var i in appControl){
   m[i] = appControl[i];
}
m.App = App;
m.getMiddleware = middleware;
//m.render = {};
//m.render.cache = cache;
