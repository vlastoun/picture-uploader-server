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
    const user = users[0];
    const superuser = roles[0];
    const admin = roles[1];
    admin.principals.create({
      principalType: RoleMapping.USER,
      principalId: user.id
    }, (err, principal)=>{
      console.log(principal)
    })
    superuser.principals.create({
      principalType: RoleMapping.USER,
      principalId: user.id
    }, (err, principal)=>{
      console.log(principal)
    })
  });
};
