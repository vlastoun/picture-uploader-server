let co = require('co');

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    co(function* () {
      const pic = yield picture.create({name: Date.now()});
      cb(null, pic);
    }).catch(err => handleError(err));
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

