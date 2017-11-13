// server.js
// author : Paul Contremoulin

// Modules Requires
var express = require('express');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Routes Requires
var portfolio = require('./server/rooter/portfolio');
var project = require('./server/rooter/project');
var account = require('./server/rooter/account');

// Util
var authenticate = require('./server/security/authenticate.js')

//Configuration
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Link for client applciation
app.use('/client', express.static(__dirname+'/client'));

// Link for admin application
app.use('/admin',  authenticate.isAdmin, express.static(__dirname+'/admin'));

//Routes
app.use('/api/portfolio', portfolio);

app.use('/api/project', project);

app.use('/api/account', account);

// Redirect to admin application
app.use('/admin', authenticate.isAdmin, function(req, res) {
  res.sendFile(__dirname + '/admin/index.html');
});

// Redirect to public application
app.use('/*', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});


// Start the application by listening on the port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

