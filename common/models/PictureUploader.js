var multiparty = require('multiparty');
var fs = require('fs');
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
        let oldPath = file.path;
        let newPath = `${PATH}${this.stamp}_${file.originalFilename}`;
        fs.rename(oldPath, newPath, (err)=>{
          if (err) {
            console.log(err);
          }
        });
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
