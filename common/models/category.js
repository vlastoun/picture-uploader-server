'use strict';

module.exports = function(Category) {
  Category.validatesUniquenessOf('name', {message: 'Category name is not unique'});
};
