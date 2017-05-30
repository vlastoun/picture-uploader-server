'use strict';
var CONTAINERS_URL = '/api/containers/';
var formidable = require('formidable');
var im = require('imagemagick');
var PATH = __dirname + '/../../files/pictures/';
/* eslint-disable max-len */
module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    var form = new formidable.IncomingForm();
    var STAMP = Date.now();
    form.multiples = false;
    form.parse(req);
    form.on('fileBegin', function(name, file) {
      var newName = STAMP + '_' + file.name;
      file.path = PATH + newName;
    });

    form.on('file', function(name, file) {
      var smallName = STAMP + '_' + 'small_' + file.name;
      im.resize({
        srcPath: file.path,
        dstPath: PATH + smallName,
        width: 256,
      }, function(err, stdout, stderr) {
        if (err) throw err;
        console.log('resized to fit within 256x256px');
      });
    });
    cb(null, 'done');
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

