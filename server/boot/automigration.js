var app = require('../server');

// this loads the accountDb configuration in ~/server/datasources.json
var dataSource = app.dataSources.postgres;

const models = [
  'ACL', 'AccessToken', 'RoleMapping',
  'user', 'post', 'category',
  'role', 'cloudinary',
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
automigrate('ACL').then(
  automigrate('AccessToken').then(
    automigrate('RoleMapping').then(
      automigrate('user').then(
        automigrate('post').then(
          automigrate('category').then(
            automigrate('role').then(
              automigrate('cloudinary').then(console.log('done'))
            )
          )
        )
      )
    )
  )
);

