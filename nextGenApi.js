var isojs = require('isojs');
var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log("STARTED SERVER! PORT: ", app.get('port'));
});

app.use(isojs.middleware());


var isojs = require('isojs');

var app = new isojs.IsoJS('AppName');


app.set('routes', Routes);



// OPTIONAL /*

app.set('title', 'MyApp');

app.set('apiUrl', 'http://localhost:8080/');

app.use(isojsBuilder)

app.set('routesFile', './Routes.react.js');



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
