'use strict';
require('dotenv').config();
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
const config = {
  'url': `${process.env.DATABASE_URL}?ssl=true`,
  'name': 'postgres',
  'connector': 'postgresql',
};
app.dataSource('postgres', config);

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
