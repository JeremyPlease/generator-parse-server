process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
  process.exit(1)
});

var reporter;
if (process.env.CIRCLE_TEST_REPORTS) {
  var Reporters = require('jasmine-reporters');
  reporter = new Reporters.JUnitXmlReporter({
    savePath: process.env.CIRCLE_TEST_REPORTS,
    consolidateAll: true
  });
} else {
  var JasmineConsoleReporter = require('jasmine-console-reporter');
  reporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    activity: false
  });

}

jasmine.getEnv().addReporter(reporter);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

// detect tests that take more than 1 sec
// http://jipiboily.com/how-to-know-jasmine-specs-are-slow/
var slowSpecsReporter = {
  specStarted: function(result) {
    this.specStartTime = Date.now()
  },
  specDone: function(result) {
    var seconds = (Date.now() - this.specStartTime) / 1000
    if (seconds > 1) {
      console.warn('WARNING - This spec took ' + seconds + ' seconds: "' + result.fullName + '"')
    }
  },
}
jasmine.getEnv().addReporter(slowSpecsReporter);

// Sets up a Parse API server for testing.
var express = require('express');
var ParseModule = require('parse-server');
var ParseServer = ParseModule.ParseServer;
var TestUtils = ParseModule.TestUtils;
var migrateSchema = require('../../app/lib/migrate_schema.js').migrateSchema;
var appRoot = __dirname+'/../../app/';

var port = 9876;

// Default server configuration for tests.
var defaultConfiguration = {
  databaseURI: 'mongodb://localhost:27017/test_parse_database',
  cloud: './app/cloud/main.js',
  serverURL: 'http://localhost:' + port + '/parse',
  appId: 'test',
  masterKey: 'test',
  collectionPrefix: 'test_',
  fileKey: 'test'
};

// Set up a default API server for testing with default configuration.
var api = new ParseServer(defaultConfiguration);
var app = express();
app.use('/parse', api);
app.listen(port);

// Set up a Parse client to talk to our test API server
var Parse = require('parse/node');
Parse.serverURL = 'http://localhost:' + port + '/parse';

beforeEach(function(done) {
  Parse.initialize('test', 'test', 'test');
  Parse.serverURL = 'http://localhost:' + port + '/parse';
  Parse.User.enableUnsafeCurrentUser();
  TestUtils.destroyAllDataPermanently().then(function() {
    migrateSchema({
      url: defaultConfiguration.serverURL+'/schemas',
      headers: {
        'X-Parse-Application-Id': defaultConfiguration.serverURL.appId,
        'X-Parse-Master-Key': defaultConfiguration.serverURL.masterKey
      },
      json: true
    }, done);
  }, fail);
});

afterEach(function(done) {
  TestUtils.destroyAllDataPermanently().then(done, fail);
});

var ParseObjects = {};
var schemas = require(appRoot+'config/schemas.json');
for (var schema in schemas) {
  ParseObjects[schemas[schema].className] =  Parse.Object.extend(schemas[schema].className);
}

// This is polluting, but, it makes it way easier to directly port old tests.
global.Parse = Parse;
global.ParseObjects = ParseObjects;
global.appRoot = appRoot;
