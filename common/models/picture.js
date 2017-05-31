'use strict';
var CONTAINERS_URL = '/api/containers/';
var formidable = require('formidable');
var im = require('imagemagick');
var fs = require('fs');
var CONTAINER = 'pictures/';
var PATH = `${__dirname}/../../files/${CONTAINER}/`;
/* eslint-disable max-len */
module.exports = function(picture) {
  picture.upload = function(req, res, postId, cb) {
    var originalName = '';
    var filePath = '';
    var STAMP = Date.now();
    var form = new formidable.IncomingForm();
    form.multiples = false;

    //read file
    form.parse(req);
    form.on('fileBegin', function(name, file) {
      originalName = file.name;
      file.name = STAMP + '_' + file.name;
      file.path = PATH + file.name;
      filePath = file.path
    })

    //resize picture
    form.on('file', function(name, file) {
      var smallName = `${STAMP}_thumbnail_${originalName}`;
      // settings
      im.resize({
        srcPath: file.path,
        dstPath: PATH + smallName,
        width: 100,
        quality: 0.8,
        format: 'jpg',
        progressive: false,
        strip: true,
        filter: 'Lagrange',
        sharpening: 0.2,
      }, function(err, stdout, stderr) {
        // if not processable then error and delete file
        if(err){
          fs.unlink(filePath, function(err){
          });
          cb('not an image')
        } else {
          cb(null, 'ok')
        }        
      });
    })
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
