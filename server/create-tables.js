const server = require('./server');
const ds = server.dataSource.postgres;
const tables = [
  'cloudinary',
  'role',
  'category',
  'post',
  'user',
  'RoleMapping',
  'ACL',
  'AccessToken',
];

ds.automigrate(tables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - tables - '] created in ', ds.adapter.name);
  ds.disconnect();
});
