const formidable = require('formidable');
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
    let form = new formidable.IncomingForm();
    form.parse(this.request);
    form.on('fileBegin', (name, file)=>{
      originalName = file.name;
      file.name = `${this.stamp}_${file.name}`;
      file.path = `${this.path}${file.name}`;
    });
  }
};
