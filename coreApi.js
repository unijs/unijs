
var unijs = require('unijs');

var app = new unijs.App('AppName');

app.Router = Routes;
app.resources.push('./bundle.js');

unijs.mount('/', app);

server.use(unijs.middleware());




// OPTIONAL /*

app.set('title', 'MyApp');

app.set('apiUrl', 'http://localhost:8080/');

app.set('bundle', './bundle.js');



app.add('forwardHeader', 'cookie');

app.add('header', '<title>MyTitle</title>');

app.add('script', './myScript.js');
app.add('style', './style.js');

app.add('rawStyle', '.myTestClass {color: #ff0000}');
app.add('rawScript', 'alert("test");');

// OPTIONAL */


isojs.mount('/', app);

isojs.unmount(app);

isojs.unmount('/');
