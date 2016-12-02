var settings = require('./config/settings.js');
var project = require('../package.json');

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var path = require('path');
var migrateSchema =  require('./lib/migrate_schema.js').migrateSchema;

var api = new ParseServer(settings.parse);
var dashboard = new ParseDashboard(settings.dashboard);
var app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(settings.parse.mountPath, api);
app.use(settings.dashboard.mountPath, dashboard);

app.get('/', function(req, res) {
  res.status(200).send('Success!');
});

app.get('/version', function(req, res) {
  res.status(200).send(project.version);
});

var httpServer = require('http').createServer(app);
httpServer.listen(settings.port, function() {
    console.log('server running on port ' + settings.port + '.');
    // run schema migration on initial server start then seed app
    migrateSchema(null, function() { });
});
