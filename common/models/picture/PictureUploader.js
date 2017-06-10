var multiparty = require('multiparty');
var fs = require('fs');
var shrinkFile = require('./ShrinkFile');
const co = require('co');
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

/**
 * Parse files from incomming request
 * @param {any} req incomming request multipart/form-data
 */
  parseRequest(req) {
    return new Promise((resolve, reject) => {
      this.request = req;
      let form = new multiparty.Form({uploadDir: PATH});
      form.on('file', (name, file) => {
        let oldPath = file.path;
        let newPath = `${PATH}${this.stamp}_${file.originalFilename}`;
        const fileData = {
          fileName: file.originalFilename,
          name: `${this.stamp}_${file.originalFilename}`,
          stamp: this.stamp,
          dstPath: PATH,
          path: newPath,
        };
        this.files.push(fileData);
        // rename to suitable name
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
  shrinkFiles() {
    return new Promise((resolve, reject)=>{
      let fileToShrink = this.files;
      let allFiles = [];
      co(function*() {
        for (let i = 0; i < fileToShrink.length; i++) {
          let result = yield {
            details: fileToShrink[i],
            thumbnail: shrinkFile(fileToShrink[i], 150, 'thumbnail'),
            small: shrinkFile(fileToShrink[i], 350, 'small'),
          };
          allFiles.push(result);
        }
        yield resolve(allFiles);
      }).catch(err => reject(err));
    });
  }
};
