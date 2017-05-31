'use strict';
var CONTAINERS_URL = '/api/containers/';
var formidable = require('formidable');
var im = require('imagemagick');
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
      var smallName = `${STAMP}_small_${originalName}`;
      // settings
      im.resize({
        srcPath: file.path,
        dstPath: PATH + smallName,
        width: 300,
      }, function(err, stdout, stderr) {
        // if not processable then error and delete file
        if(err){
          fs.unlink(filePath, function(err){
          });
          cb('not an image')
        } else { 
          var thumbnailName = `${STAMP}_thumbnail_${originalName}`;
          im.resize({
            srcPath: file.path,
            dstPath: PATH + thumbnailName,
            width: 100,
            quality: 0.8,
            progressive: false,
            strip: true,
            filter: 'Lagrange',
            sharpening: 0.2,        
          }, function (err, stdout, stderr){
            if (err) console.log(err);
          });
          picture.create({
            name: file.name,
            type: file.type,
            url: `${CONTAINERS_URL}${CONTAINER}download/${file.name}`,
            small: `${CONTAINERS_URL}${CONTAINER}download/${smallName}`,
            thumbnail: `${CONTAINERS_URL}${CONTAINER}download/${thumbnailName}`,
            postId: postId,
          }, function(err, object){
            if (err){
              cb(err)
            } else {
              cb(null, object);
            }
          })
        }        
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

