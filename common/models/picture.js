'use strict';
var CONTAINERS_URL = '/api/containers/';
var formidable = require('formidable');
/* eslint-disable max-len */
module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    var form = new formidable.IncomingForm();
    form.multiples = false;
    form.parse(req);
    form.on('fileBegin', function(name, file) {
      file.path = __dirname + '/../../files/pictures/' + Date.now() + '_' + file.name;
    });
    form.on('progress', function(bytesReceived, bytesExpected) {
      var percentCompleted = (bytesReceived / bytesExpected) * 100;
      console.log(percentCompleted.toFixed(2));
    });
    form.on('file', function(name, file) {
      console.log(file);
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
