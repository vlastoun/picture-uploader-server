'use strict';
var CONTAINERS_URL = '/api/containers/';
var formidable = require('formidable');
var im = require('imagemagick');
var CONTAINER = 'pictures/';
var PATH = __dirname + `/../../files/${CONTAINER}/`;
/* eslint-disable max-len */
module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    var originalName = '';
    var STAMP = Date.now();
    var form = new formidable.IncomingForm();
    form.multiples = false;
    form.parse(req);
    form.on('fileBegin', function(name, file) {
      originalName = file.name;
      file.name = STAMP + '_' + file.name;
      file.path = PATH + file.name;
    });

    form.on('file', function(name, file) {
      var smallName = `${STAMP}_small_${originalName}`;
      im.resize({
        srcPath: file.path,
        dstPath: PATH + smallName,
        width: 256,
      }, function(err, stdout, stderr) {
        if (err) throw err;
        picture.create({
          name: file.name,
          type: 'unknown',
          postId: postId,
          url: `${CONTAINERS_URL}${CONTAINER}download/${file.name}`,
        }, function(err, object) {
          err
            ? cb(err)
            : cb(null, object);
        });
      });
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
