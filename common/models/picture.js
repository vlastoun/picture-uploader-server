// run generator
const co = require('co');
const formidable = require('formidable');
const CONTAINER = 'pictures';
const PATH = `${__dirname}/../../files/${CONTAINER}/`;

function parseFile(req) {
  const STAMP = Date.now();
  let originalName = '';
  let filePicture;
  let form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', (name, file)=>{
    originalName = file.name;
    file.name = `${STAMP}_${file.name}`;
    file.path = `${PATH}${file.name}`;
    filePicture = file.File;
    console.log(filePicture);
  });
  return Promise.resolve(filePicture);
}

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    co(function* () {
      try {
        file = yield parseFile(req);
      } catch (error) {
        console.log(error.details);
      }
    });
  };

  picture.remoteMethod(
    'upload',
    {
      http: {path: '/upload', verb: 'post'},
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}},
        {arg: 'postId', type: 'string', required: true},
      ],
      returns: {arg: 'status', type: 'string'},
    }
  );
};

