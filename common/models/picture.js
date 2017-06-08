var Bl = require('bluebird');

module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    Bl.coroutine(function* () {
      var pic = yield picture.create({description: Date.now()});
      var found =  yield picture.findById(5);
    })().catch((err)=>{console.log(err.details)});
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

