// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
require('dotenv').config();
module.exports = function (app) {
  console.log('password:', process.env.ADMIN_PASSWORD);
  const User = app.models.user;
  const Role = app.models.Role;
  const Category = app.models.category;
  const RoleMapping = app.models.rolemapping;

  RoleMapping.belongsTo(User);
  RoleMapping.belongsTo(Role);
  User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});
  User.hasMany(RoleMapping, {foreignKey: 'principalId'});
  Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
  const users = [
    { username: 'vlastoun', email: 'vlastoun@gmail.com', password: process.env.ADMIN_PASSWORD },
  ];

  const categories = [
    { name: 'prvni kategorie', description: 'popis prvni kategorie' },
    { name: 'druha kategorie', description: 'popis druhe kategorie' },
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
    })
    admin.principals.create({
      principalType: RoleMapping.USER,
      principalId: users[1].id
    }, (err, principal)=>{
    })
  }).then(()=>{
    console.log('Default users created')
    User.observe('after save', (ctx, next)=>{
      if(ctx.isNewInstance) {
        Role.findOne({where: {name: 'user'}}, (error, role) => {
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: ctx.instance.id,
          }, (error, principal) => {
            console.log(principal);
            next()
          })      
        })
      }
    });
  })
};
