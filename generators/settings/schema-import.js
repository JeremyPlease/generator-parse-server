var request = require('request');

module.exports.import = _import;

function _import(options, callback) {
  var requestOptions = {
    url: 'https://api.parse.com/1/schemas',
    method: 'GET',
    headers: {
      'X-Parse-Application-Id': options.appId,
      'X-Parse-Master-Key': options.masterKey
    },
    json: true
  };

  request(requestOptions, function(error, response, body) {
    if (error || (body && body.code)) {
      callback('ERROR ', body);
    } else {
      callback(null, body.results);
    }
  });
}
