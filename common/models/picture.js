'use strict';
var CONTAINERS_URL = '/api/containers/';

module.exports = function(picture) {
  picture.upload = function(req, res, cb) {
    var StorageContainer = picture.app.models.container;
    StorageContainer.upload(req, res, {container: 'pictures'}, cb);
  };

  picture.remoteMethod(
    'upload',
    {
      http: {path: '/upload', verb: 'post'},
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}},
      ],
      returns: {arg: 'status', type: 'string'},
    }
  );
};
