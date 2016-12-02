<% if (setupS3) { %>
var S3Adapter = require('parse-server').S3Adapter;
<% } %>

var settings = {
  port: process.env.PORT || <%= port %>,
  parse: {
    databaseURI: process.env.DATABASE_URI || "<%= databaseUri %>",
    cloud: __dirname + "/../cloud/main.js",
    appId: process.env.APP_ID || "<%= appId %>",
    appName: process.env.APP_NAME || "<%= appName %>",
    masterKey: process.env.MASTER_KEY || "<%= masterKey %>",
    fileKey: process.env.FILE_KEY || "<%= fileKey %>",
    serverURL: process.env.SERVER_URL || "http://localhost:<%= port %>/parse",
    publicServerURL: process.env.PUBLIC_SERVER_URL || "http://localhost:<%= port %>/parse",
    mountPath: "/parse",
    allowClientClassCreation: false,
    logLevel: process.env.LOG_LEVEL || 'warn',
    push: {
      // android: {},
      // ios: []
    },
    <% if (setupS3) { %>
    filesAdapter: new S3Adapter(
      process.env.AWS_ID || "<%= awsId %>",
      process.env.AWS_SECRET_KEY || "<%= awsSecretKey %>",
      process.env.AWS_BUCKET_NAME || "<%= awsBucketName %>",
      {directAccess: <%= !!directAccess %>}
    ),
    <% } %>
    <% if (setupMailgun) { %>
    emailAdapter: {
      module: 'parse-server-simple-mailgun-adapter',
      options: {
        apiKey: process.env.MAILGUN_KEY || "<%= mailgunKey %>",
        domain: process.env.MAILGUN_DOMAIN || "<%= mailgunDomain %>",
        fromAddress: process.env.MAILGUN_FROM_ADDRESS || "<%= mailgunFromAddress %>"
      }
    },
    <% } %>
  }
};

settings.dashboard = {
  apps: [{
    serverURL: settings.parse.publicServerURL,
    appId: settings.parse.appId,
    masterKey: settings.parse.masterKey,
    appName: settings.parse.appName,
  }],
  users: [{
    user: process.env.DASHBOARD_USER || "<%= dashboardUser %>",
    pass: process.env.DASHBOARD_PASSWORD || "<%= dashboardPassword %>"
  }],
  mountPath: '/dashboard'
};

module.exports = settings;
