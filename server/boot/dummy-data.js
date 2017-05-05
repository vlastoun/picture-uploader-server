// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function (app) {
  var User = app.models.user;

  User.create([
    { username: 'John', email: 'john@doe.com', password: 'opensesame' },
    { username: 'Jane', email: 'jane@doe.com', password: 'opensesame' },
    { username: 'Bob', email: 'bob@projects.com', password: 'opensesame' }
  ], function (err, users) {
    if (err) throw err;
    console.log('Created users', users);
    })
};
