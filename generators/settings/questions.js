module.exports = [
    {
      type: 'input',
      name: 'port',
      message: 'The port to run server on',
      default: 1337
    },
    {
      type: 'input',
      name: 'databaseUri',
      message: 'MongoDB database uri',
      default: 'mongodb://localhost:27017/parse_server'
    },
    {
      type: 'input',
      name: 'appName',
      message: 'Parse App Name',
      default: 'Parse App'
    },
    {
      type: 'input',
      name: 'appId',
      message: 'Parse App Id',
      default: 'parse-app'
    },
    {
      type: 'input',
      name: 'masterKey',
      message: 'Parse master key',
      default: function() {
        var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < 40; i++) {
        randomString += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return randomString;
      }
    },
     {
      type: 'input',
      name: 'fileKey',
      message: 'Parse file key',
      default: ''
    },
    {
      type: 'input',
      name: 'dashboardUser',
      message: 'Parse dashboard username',
      default: 'user'
    },
    {
      type: 'input',
      name: 'dashboardPassword',
      message: 'Parse dashboard password',
      default: 'password'
    },
    {
      type: 'confirm',
      name: 'importSchema',
      message: 'Attempt to import schema from parse.com hosted app?',
      default: false
    },
    {
      type: 'input',
      name: 'collectionInfo',
      message: 'Please go to https://parse.com/apps/PARSE_APP_URL_NAME/collections/info and paste response here',
      when: function(answers) {
        return answers.importSchema;
      },
      validate: function(input) {
        if (!input || !input.length) {
          return "JSON does not have \"collections\""
        }
        return true;
      },
      filter: function(input) {
        var json;
        try {
          json = JSON.parse(input);
        } catch(e) {
          console.log(e);
          return {};
        }
        return json.collections;
      }
    },
    {
      type: 'confirm',
      name: 'setupS3',
      message: 'Setup S3 file storage adapter?',
      default: false
    },
    {
      type: 'input',
      name: 'awsId',
      message: 'AWS key id',
      when: function(answers) {
        return answers.setupS3;
      }
    },
    {
      type: 'input',
      name: 'awsSecretKey',
      message: 'AWS secret key',
      when: function(answers) {
        return answers.setupS3;
      }
    },
    {
      type: 'input',
      name: 'awsBucketName',
      message: 'AWS bucket name',
      when: function(answers) {
        return answers.setupS3;
      }
    },
    {
      type: 'confirm',
      name: 'directAccess',
      message: 'Enable directAccess on S3 files (do not proxy through server)',
      default: true,
      when: function(answers) {
        return answers.setupS3;
      }
    },
    {
      type: 'confirm',
      name: 'setupMailgun',
      message: 'Setup simple Mailgun email adapter?',
      default: false
    },
    {
      type: 'input',
      name: 'mailgunKey',
      message: 'Mailgun key',
      when: function(answers) {
        return answers.setupMailgun;
      }
    },
    {
      type: 'input',
      name: 'mailgunDomain',
      message: 'Mailgun domain',
      when: function(answers) {
        return answers.setupMailgun;
      }
    },
    {
      type: 'input',
      name: 'mailgunFromAddress',
      message: 'Mailgun from address',
      when: function(answers) {
        return answers.setupMailgun;
      }
    }
]
