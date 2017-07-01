
module.exports = function (app) {
  const _ = require('lodash');
  const User = app.models.user;
  const Role = app.models.role;
  const RoleMapping = app.models.RoleMapping;
  const ACL = app.models.ACL;
  ACL.create({
    model: 'user',
    property: '*',
    accessType: '*',
    principalType: 'ROLE',
    principalId: 'superuser',
    permission: 'ALLOW'
  }, function (err, acl) { // Create the acl
    if (err) console.error(err);
  });

  ACL.create({
    model: 'role',
    property: '*',
    accessType: '*',
    principalType: 'ROLE',
    principalId: 'superuser',
    permission: 'ALLOW'
  }, function (err, acl) { // Create the acl
    if (err) console.error(err);
  });

  ACL.create({
    model: 'RoleMapping',
    property: '*',
    accessType: '*',
    principalType: 'ROLE',
    principalId: 'superuser',
    permission: 'ALLOW'
  }, function (err, acl) { // Create the acl
    if (err) console.error(err);
  });
/**
   * Add a user to the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  User.addRole = function(userId, roleId, cb) {
    var error;

    User.findOne({ where: { id: userId } }, function(err, user) { // Find the user...
      if (err) cb(err); // Error

      if (!_.isEmpty(user)) {
        Role.findOne({ where: { id: roleId } }, function(err, role) { // Find the role...
          if (err) cb(err); // Error

          if (!_.isEmpty(role)) {
            RoleMapping.findOne({ where: { principalId: userId, roleId: roleId } }, function(err, roleMapping) { // Find the role mapping...
              if (err) cb(err); // Error

              if (_.isEmpty(roleMapping)) { // Only create if one doesn't exist to avoid duplicates
                role.principals.create({
                  principalType: RoleMapping.USER,
                  principalId: user.id
                }, function(err, principal) {
                  if (err) cb(err); // Error

                  cb(null, role); // Success, return role object
                });
              } else {
                cb(null, role); // Success, return role object
              }
            });

          } else {
            error = new Error('Role.' + roleId + ' was not found.');
            error.http_code = 404;
            cb(error); // Error
          }
        });
      } else {
        error = new Error('User.' + userId + ' was not found.');
        error.http_code = 404;
        cb(error); // Error
      }
    });
  };

  User.remoteMethod(
    'addRole',
    {
      accepts: [
        {arg: 'userId', type: 'string'},
        {arg: 'roleId', type: 'string'}
      ],
      http: {
        path: '/add-role',
        verb: 'post'
      },
      returns: {type: 'object', root: true}
    }
  );

  /**
   * Remove a user from the given role.
   * @param {string} userId
   * @param {string} roleId
   * @param {Function} cb
   */
  User.removeRole = function(userId, roleId, cb) {
    var error;

    User.findOne({ where: { id: userId } }, function(err, user) { // Find the user...
      if (err) cb(err); // Error

      if (!_.isEmpty(user)) {
        Role.findOne({ where: { id: roleId } }, function(err, role) { // Find the role...
          if (err) cb(err); // Error

          if (!_.isEmpty(role)) {
            RoleMapping.findOne({ where: { principalId: userId, roleId: roleId } }, function(err, roleMapping) { // Find the role mapping...
              if (err) cb(err); // Error

              if (!_.isEmpty(roleMapping)) {
                roleMapping.destroy(function(err) {
                  if (err) cb(err); // Error

                  cb(null, role); // Success, return role object
                });
              } else {
                cb(null, role); // Success, return role object
              }
            });
          } else {
            error = new Error('Role.' + roleId + ' was not found.');
            error.http_code = 404;
            cb(error); // Error
          }
        });
      } else {
        error = new Error('User.' + userId + ' was not found.');
        error.http_code = 404;
        cb(error); // Error
      }
    });
  };

  User.remoteMethod(
    'removeRole',
    {
      accepts: [
        {arg: 'userId', type: 'string'},
        {arg: 'roleId', type: 'string'}
      ],
      http: {
        path: '/remove-role',
        verb: 'post'
      }
    }
  );
};
