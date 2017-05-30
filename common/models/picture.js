'use strict';
var CONTAINERS_URL = '/api/containers/';
/* eslint-disable max-len */
module.exports = function(picture) {
  picture.upload = function(req, res, cb) {
    var StorageContainer = picture.app.models.container;
    StorageContainer.upload(req, res, {container: 'pictures'}, function(err, file) {
      if (err) {
        cb(err);
      } else {
        var fileInfo = file.files.image[0];
        picture.create({
          name: fileInfo.name,
          type: fileInfo.type,
          container: fileInfo.container,
          postId: file.fields.postId,
          url: CONTAINERS_URL + fileInfo.container + '/download/' + fileInfo.name,
        }, function(err, object) {
          if (err) {
            cb(err);
          } else {
            cb(null, object);
          }
        });
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
      ],
      returns: {arg: 'status', type: 'string'},
    }
  );
};
