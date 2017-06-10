var multiparty = require('multiparty');
var fs = require('fs');
const CONTAINER = 'pictures';
const PATH = `${__dirname}/../../../files/${CONTAINER}/`;

module.exports = class PictureUploader {
  constructor(path = PATH, container = CONTAINER) {
    this.path = path;
    this.container = container;
    this.originalName = '';
    // convert backwards Number = parseInt(hexString, 16);
    this.stamp = Date.now().toString(16);
    this.files = [];
    this.request = {};
  }

  parseRequest(req) {
    return new Promise((resolve, reject) => {
      this.request = req;
      let form = new multiparty.Form({uploadDir: PATH});
      form.on('file', (name, file) => {
        let oldPath = file.path;
        let newPath = `${PATH}${this.stamp}_${file.originalFilename}`;
        console.log(file);
        const fileData = {
          fileName: file.originalFilename,
          stamp: this.stamp,
          path: newPath,
        };
        this.files.push(fileData);
        fs.rename(oldPath, newPath, (err)=>{
          if (err) {
            reject(Error(err));
          }
        });
      });
      form.on('aborted', () => {
        reject(Error('aborted'));
      });
      form.on('close', ()=>{
        resolve('done');
      });

      form.parse(req, (err, fields, files)=>{
        if (err) {
          reject(Error(err));
        }
      });
    });
  }
};
