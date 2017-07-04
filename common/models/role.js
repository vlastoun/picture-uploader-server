'use strict';

module.exports = function(Role) {
  Role.validatesUniquenessOf('name', {message: 'name is not unique'});
};
