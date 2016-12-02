var request = require('request');
var async = require('async');
var schemas = require('../config/schemas.json');
var config = require('../config/settings.js');

var defaultFields = [
  "objectId",
  "updatedAt",
  "createdAt",
  "ACL",
  "_Installation.installationId",
  "_Installation.deviceToken",
  "_Installation.channels",
  "_Installation.deviceType",
  "_Installation.pushType",
  "_Installation.GCMSenderId",
  "_Installation.timeZone",
  "_Installation.localeIdentifier",
  "_Installation.badge",
  "_Installation.appVersion",
  "_Installation.appName",
  "_Installation.appIdentifier",
  "_Installation.parseVersion",
  "_User.username",
  "_User.password",
  "_User.authData",
  "_User.email",
  "_User.emailVerified",
  "_Role.name",
  "_Role.users",
  "_Role.roles",
  "_Session.createdWith",
  "_Session.expiresAt",
  "_Session.installationId",
  "_Session.restricted",
  "_Session.sessionToken",
  "_Session.user"
];

module.exports.migrateSchema = _migrateSchema;

var requestOptions = {
  url: config.parse.serverURL+'/schemas',
  headers: {
    'X-Parse-Application-Id': config.parse.appId,
    'X-Parse-Master-Key': config.parse.masterKey
  },
  json: true
};

function _migrateSchema(overrideOptions, finalCallback) {
  requestOptions = overrideOptions || requestOptions;

  _getSchemas(function(existingSchemas) {
    existingSchemas = existingSchemas.results.reduce(function(all, current) {
        all[current.className] = current;
        return all;
    }, {});
    var schemaFunctions = [];
    var schemasCopy = JSON.parse(JSON.stringify(schemas));
    schemasCopy.forEach(function(schema) {
      schemaFunctions.push(function(callback) {
        if (existingSchemas[schema.className]) {
          _updateSchema(schema, existingSchemas[schema.className], callback);
        } else {
          _createSchema(schema, callback);
        }
      });
    });
    async.parallel(schemaFunctions, function(error, results) {
      if (error) {
        console.log('ERROR: Schema not updated', results);
      } else {
        finalCallback && finalCallback();
      }
    });
  });
}

function _getSchemas(callback) {
  _makeRequest('GET', requestOptions.url, true, function(error, response) {
    callback((error ? false : response));
  });
}

function _updateSchema(schema, existingSchema, callback) {
  for (fieldName in existingSchema.fields) {
    if (
      !_isDefaultField(fieldName, schema.className) &&
      !schema.fields[fieldName]
    ) {
      console.log('Schema: deleting '+fieldName+' from '+schema.className);
      schema.fields[fieldName] = {"__op" : "Delete"};
    }
  }
  // remove existing fields
  for (var fieldName in schema.fields) {
    if (
      schema.fields[fieldName].__op != 'Delete' &&
      existingSchema && existingSchema.fields && existingSchema.fields[fieldName]
    ) {
      delete schema.fields[fieldName];
    }
  }
  _makeRequest('PUT', requestOptions.url + '/' + schema.className, schema, callback);
}

function _createSchema(schema, callback) {
  for (var field in schema.fields) {
    if (_isDefaultField(field, schema.className)) {
      delete schema.fields[field];
    }
  }
  _makeRequest('POST', requestOptions.url, schema, callback);
}

function _makeRequest(method, url, json, callback) {
  var options = Object.assign({}, requestOptions);
  options.method = method;
  options.url = url;
  options.json = json;
  request(options, function(error, response, body) {
    if (error || (body && body.code)) {
      callback('ERROR ' + url, body);
    } else {
      callback(null, body);
    }
  });
}

function _isDefaultField(fieldName, className) {
  if (
    defaultFields.indexOf(className+'.'+fieldName) != -1 ||
    defaultFields.indexOf(fieldName) != -1
  ) {
    return true;
  }
  return false;
}
