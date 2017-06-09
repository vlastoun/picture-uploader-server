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
    return new Promise((resolve, reject) => {
      this.request = req;
      let result;
      var form = new multiparty.Form({uploadDir: PATH});
      form.on('file', (name, file) => {
        console.log(file.fieldName);
      });
      form.on('aborted', () => {
        reject(Error('aborted'));
      });
      form.on('close', function() {
        resolve('done');
      });

      form.parse(req, function(err, fields, files) {
        if (err) {
          result = new Error(err);
        }
      });
    });
  }
};
