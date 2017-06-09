var multiparty = require('multiparty');
const CONTAINER = 'pictures';
const PATH = `${__dirname}/../../files/${CONTAINER}/`;

module.exports = class PictureUploader {
  constructor() {
    this.path = PATH;
    this.container = CONTAINER;
    this.originalName = '';
    this.stamp = Date.now();
    this.File = {};
  }

  parseRequest(req) {
    this.request = req;
    var form = new multiparty.Form({uploadDir: PATH});
    form.parse(req, function(err, fields, files) {
      Object.keys(fields).forEach(function(name) {
        console.log('got field named ' + name);
      });

      Object.keys(files).forEach(function(name) {
        console.log('got file named ' + name);
      });

      console.log('Upload completed!');
    });
  }
};
