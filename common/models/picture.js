// run generator
const co = require('co');
const formidable = require('formidable');

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    co(function* () {
      try {
        const pic = yield picture.create({description: Date.now()});
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

