// run generator
const co = require('co');
const PictureUploader = require('./picture/PictureUploader');

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    let pic = new PictureUploader();
    pic.parseRequest(req).then(res => cb(null, res));
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

