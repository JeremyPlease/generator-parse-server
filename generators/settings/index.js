'use strict';

var yeoman = require('yeoman-generator');

var questions = require('./questions.js');
var templates = require('./templates.js');
var schemaImport = require('./schema-import.js');

module.exports = yeoman.Base.extend({

  prompting: function() {
    return this.prompt(questions).then(function(answers) {
      this.props = answers
      this.log(answers.name);
    }.bind(this));
  },

  writing: function () {
    var deferred = Promise.defer();
    if (this.props.importSchema) {
      schemaImport.import(this.props, (function(error, results) {
        if (error || !results || !results.length) {
          console.log('Schema import failed: ', error);
          console.log('results: ', results);
        } else {
          if (this.props.collectionInfo) {
            for (var i = 0; i < results.length; i++) {
              for (var j = 0; j < this.props.collectionInfo.length; j++) {
                if (results[i].className == this.props.collectionInfo[j].id) {
                  results[i].classLevelPermissions = this.props.collectionInfo[j].client_permissions;
                  break;
                }
              }
            }
          }
          this.props.schemas = JSON.stringify(results, null, 2);
        }
        deferred.resolve();
      }).bind(this));
    } else {
      deferred.resolve();
    }

    return deferred.promise.then((function() {
      for (var i = 0; i < templates.length; i++) {
        this.fs.copyTpl(
          this.templatePath(templates[i].templatePath),
          this.destinationPath(templates[i].destinationPath),
          this.props
        );
      }
    }).bind(this));
  },

  install: function () {

  }
});
