var app = require('../server');

// this loads the accountDb configuration in ~/server/datasources.json
var dataSource = app.dataSources.postgres;

const models = [
  'ACL', 'AccessToken',
  'user', 'post', 'category',
  'role', 'cloudinary', 'rolemapping',
];
const automigrate = (data) => new Promise((resolve, reject)=>{
  dataSource.isActual(data, function(err, actual) {
    if (!actual) {
      dataSource.autoupdate(data, function(err, result) {
        if (err) throw err;
        console.log('done', data);
        dataSource.disconnect();
      });
    }
  });
});

automigrate(models).then(console.log('db migrated'));

