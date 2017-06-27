// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function (app) {
  const User = app.models.user;
  const Role = app.models.Role;
  const Category = app.models.category;
  const RoleMapping = app.models.RoleMapping;

  RoleMapping.belongsTo(User);
  RoleMapping.belongsTo(Role);
  User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});
  User.hasMany(RoleMapping, {foreignKey: 'principalId'});
  Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
  
  const users = [
    { username: 'vlastoun', email: 'vlastoun@gmail.com', password: 'lopatka' },
    { username: 'user', email: 'user@gmail.com', password: 'lopatka' },
    { username: 'admin', email: 'admin@gmail.com', password: 'lopatka' },
  ];

  const categories = [
    { name: 'vlastoun', description: 'vlastoun@gmail.com' },
    { name: 'user', description: 'user@gmail.com' },
    { name: 'admin', description: 'admin@gmail.com' },
  ];

  const roles = [
    { name: "superuser" },
    { name: "admin" },
    { name: "user" }
    ];
  
  const createUsers = new Promise((resolve, reject)=>{
    User.create(users, (err, users)=>{
      err
      ? reject(err)
      : resolve(users)
    });
  });

  const createRoles = new Promise((resolve, reject)=>{
    Role.create(roles, (err, roles)=>{
      err
      ? reject(err)
      : resolve(roles)
    })
  })

  Promise.all([
    createUsers,
    createRoles,
  ]).then(([users, roles], err) => {
    const superuser = roles[0];
    const admin = roles[1];
    superuser.principals.create({
      principalType: RoleMapping.USER,
      principalId: users[0].id
    }, (err, principal)=>{
      console.log('superuser', principal)
    })
    admin.principals.create({
      principalType: RoleMapping.USER,
      principalId: users[1].id
    }, (err, principal)=>{
      console.log('admin', principal)
    })
    admin.principals.create({
      principalType: RoleMapping.USER,
      principalId: users[2].id
    }, (err, principal)=>{
      console.log('admin', principal)
    })
  });

  Category.create(categories, (err, categories)=>{
    console.log(categories);
  })
};
