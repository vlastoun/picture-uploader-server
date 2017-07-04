'use strict';
require('dotenv').config();
var loopback = require('loopback');
var boot = require('loopback-boot');

console.log(process.env.NODE_ENV);
var app = module.exports = loopback();
if (process.env.DATABASE_URL) {
  console.log('heroku');
  const config = {
    'url': `${process.env.DATABASE_URL}?ssl=true`,
    'name': 'postgres',
    'connector': 'postgresql',
  };
  app.dataSource('postgres', config);
} else {
  console.log('DB localhost');
  const config = {
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'host': process.env.DB_HOST,
    'database': process.env.DB_DATABASE,
    'name': 'postgres',
    'connector': 'postgresql',
  };
  app.dataSource('postgres', config);
}

app.start = function() {
  // start the web server
  var port = process.env.PORT || 8080;
  return app.listen(port, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
