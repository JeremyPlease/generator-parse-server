'use strict';

var yeoman = require('yeoman-generator');

var questions = require('./questions.js');
var templates = require('./templates.js');

module.exports = yeoman.Base.extend({

  initializing: function () {
    this.composeWith('parse-server:settings');
  },

  prompting: function() {
    return this.prompt(questions).then(function(answers) {
      this.props = answers
    }.bind(this));
  },

  writing: function () {
    var options = {
      globOptions: {
        dot: true,
        ignore: ['**/.DS_Store', '**/_package.json']
      }
    };
    for (var i = 0; i < templates.length; i++) {
      this.fs.copyTpl(
        this.templatePath(templates[i].templatePath),
        this.destinationPath(templates[i].destinationPath),
        this.props,
        {},
        options
      );
    }
  },

  install: function () {
    this.npmInstall();
  }
});
