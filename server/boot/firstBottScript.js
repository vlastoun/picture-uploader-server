// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function (app) {
  const User = app.models.user;
  const Category = app.models.category;
  const Role = app.models.role;
  const RoleMapping = app.models.RoleMapping;

  RoleMapping.belongsTo(User);
  User.hasMany(RoleMapping, {foreignKey: 'principalId'});
  Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
  

  const users = [
    { username: 'vlastoun', email: 'vlastoun@gmail.com', password: 'lopatka' },
  ];

  const roles = [
    { name: "superuser" },
    { name: "admin" },
    { name: "user" }
    ];



  User.create(users, function (err, users) {
    if (err) throw err;
    Role.create(roles, (err, role) => {
    if(err){
      console.log(err)
    }
    RoleMapping.create()
    });
  
  });
};
