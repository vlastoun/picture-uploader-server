var app = require('../server');

// this loads the accountDb configuration in ~/server/datasources.json
var dataSource = app.dataSources.postgres;

const models = [
  'AccessToken', 'ACL', 'RoleMapping',
  'user', 'post', 'category', 'role', 'cloudinary',
];
// dataSource.automigrate(models, function(err) {
//   if (err) throw err;
//   console.log(models);
//   dataSource.disconnect();
// });

dataSource.isActual(models, function(err, actual) {
  if (!actual) {
    dataSource.autoupdate(models, function(err, result) {
      if (err) throw err;
      console.log(models);
      dataSource.disconnect();
    });
  }
});
