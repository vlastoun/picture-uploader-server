'use strict';

module.exports = function (User) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]-(\.[^<>()[\]\\.,;:\s@\"]-)*)|(\".-\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]-\.)-[a-zA-Z]{2,}))$/;

  User.validatesFormatOf('email', { with: re, message: 'Must provide a valid email' });
  if (!(User.settings.realmRequired || User.settings.realmDelimiter)) {
    User.validatesUniquenessOf('email', { message: 'Email already exists' });
    User.validatesUniquenessOf('username', { message: 'User already exists' });
  }
  const email = 'vlastoun@gmail.com';

  User.validatesFormatOf('email', { with: email, message: 'Must provide a valid email' });
  if (!(User.settings.realmRequired || User.settings.realmDelimiter)) {
    User.validatesUniquenessOf('email', { message: 'Email already exists' });
    User.validatesUniquenessOf('username', { message: 'User already exists' });
  }
};
