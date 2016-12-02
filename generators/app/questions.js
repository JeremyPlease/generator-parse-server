module.exports = [
    {
      type: 'input',
      name: 'name',
      message: 'Your project name',
      // Defaults to the project's folder name if the input is skipped
      default: this.appname
    },
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Your project repo url',
      default: ''
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name',
      default: ''
    },

]