/**
 * This is the Parse Cloud code file that gets loaded by Parse Server.
 * Define cloud functions/hooks here or require other files
 */

Parse.Cloud.define('test', function(req, res) {
  res.success('Success!');
});
