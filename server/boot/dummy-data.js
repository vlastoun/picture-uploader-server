// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function (app) {
  const User = app.models.user;
  const Category = app.models.category



  Category.create([
    {
      name: "prvni kategorie",
      description: "popispplkasldkas;ldk kklkkajsldkj oeiiepuepokf"
    },
    {
      name: "tret kategorie",
      description: "fuckoff fuckoff fuckoff"
    },
    {
      name: "druha kategorie",
      description: "fuckoff fuckoflaksd;lkas;dlka;lsdk;alslkdlkj"
    }
    ], (err, data) => {
    err
      ? console.log(err)
      : console.log("categories created")
    }
  );


  User.create([
    { username: 'admin', email: 'admin@admin', password: 'admin' },
    { username: 'John', email: 'john@doe.com', password: 'opensesame' },
    { username: 'Jane', email: 'jane@doe.com', password: 'opensesame' },
    { username: 'Bob', email: 'bob@projects.com', password: 'opensesame' }
  ], function (err, users) {
    if (err) throw err;
    console.log("Users created");
  })
};
