'use strict';

var App = require('./App.js');
var appControl = require('./appControl.js');
var requestHandler = require('./requestHandler.js');
var cache = require('./render/cache.js');

var m = module.exports = {};

for (var i in appControl) {
   m[i] = appControl[i];
}
m.App = App;
m.getRequestHandler = requestHandler;
m.render = {};
m.render.cache = cache;