// run generator
const co = require('co');
const formidable = require('formidable');
const CONTAINER = 'pictures';
const PATH = `${__dirname}/../../files/${CONTAINER}/`;
const PictureUploader = require('./PictureUploader');

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    let pic = new PictureUploader();
    pic.parseRequest(req);
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

