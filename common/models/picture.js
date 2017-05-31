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
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req);

    form.on('fileBegin', function(name, file) {
      originalName = file.name;
      file.name = STAMP + '_' + file.name;
      file.path = PATH + file.name;
      filePath = file.path
    });

    form.on('file', function(name, file) {
      var smallName = `${STAMP}_thumbnail_${originalName}`;
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
        if(err){
          fs.unlink(filePath, function(err){
            cb('not processable image');
          });
        }        
      });
    });

    form.on('file', function(name, file) {
      var smallName = `${STAMP}_small_${originalName}`;
      im.resize({
        srcPath: file.path,
        dstPath: PATH + smallName,
        width: 256,
      }, function(err, stdout, stderr) {
        if(err){
          fs.unlink(filePath, function(err){
            cb('not processable image');
          });
        }      
      });
    }); 

    form.on('error', function(err, file) {
      cb('error occured')
      console.log(file.name);
    });

    form.on('aborted', function() {
      cb('uploading aborted')
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
