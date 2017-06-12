// run generator
const co = require('co');
var fs = require('fs');
const PictureUploader = require('./picture/PictureUploader');
const CONTAINERS_URL = '/api/containers/';
const CONTAINER = 'pictures';
const PATH = `${__dirname}/../../files/${CONTAINER}/`;

module.exports = function(picture) {
  /**********************************************************************/
  /* Update remote method
  /**********************************************************************/
  function update(PictureId, postId, title, description) {
    return new Promise((resolve, reject)=>{
      picture.updateAll({id: PictureId}, {
        title: title,
        description: description,
        postId: postId,
      }, (err, info)=>{
        if (err) {
          reject(err);
        } else {
          const data = {
            id: PictureId,
            title: title,
            description: description,
            postId: postId,
          };
          resolve(data);
        }
      });
    });
  }

  picture.updatedata = function(
    PictureId, postId, title, description, callback) {
    co(function*() {
      const data = yield findById(PictureId);
      if (data !== null) {
        let result = yield update(PictureId, postId, title, description);
        callback(null, result);
      }
    }).catch(error => callback(error));
  };
  picture.remoteMethod(
    'updatedata',
    {
      http: {path: '/updatedata', verb: 'post'},
      accepts: [
        {arg: 'PictureId', type: 'string', required: true},
        {arg: 'postId', type: 'string'},
        {arg: 'title', type: 'string'},
        {arg: 'description', type: 'string'},
      ],
      returns: {arg: 'status', type: 'string'},
    }
  );
  /**********************************************************************/
  /* Create remote method
  /**********************************************************************/
  function createEntryInDb(file, postId) {
    return new Promise((resolve, reject)=>{
      picture.create({
        title: '',
        description: '',
        name: file.details.name,
        type: 'image',
        url: `${CONTAINERS_URL}${CONTAINER}/download/${file.details.name}`,
        urlSmall: `${CONTAINERS_URL}${CONTAINER}/download/${file.thumbnail}`,
        urlThumbnail: `${CONTAINERS_URL}${CONTAINER}/download/${file.small}`,
        nameSmall: file.small,
        nameThumbnail: file.thumbnail,
        postId: postId,
      }, (err, object)=>{
        if (err) {
          reject(err);
        } else {
          resolve(object);
        }
      });
    });
  }

  picture.upload = function(req, res, postId, cb) {
    let pictures = co(function*() {
      let pic = new PictureUploader();
      yield pic.parseRequest(req);
      let files = yield pic.shrinkFiles();
      let createdFiles = [];
      for (let i = 0; i < files.length; i++) {
        let result = yield createEntryInDb(files[i], postId);
        createdFiles.push(result);
      }
      cb(null, createdFiles);
    })
    .catch(err => { cb(err); });
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

  /**********************************************************************/
  /* Delete remote method
  /**********************************************************************/
  function findById(Id) {
    return new Promise((resolve, reject)=>{
      picture.findById(Id, (err, data)=>{
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  function deleteFile(filename) {
    return new Promise((resolve, reject)=>{
      let deletedFile = filename;
      fs.unlink(`${PATH}${filename}`, () => {
        resolve('deleted ');
      });
    });
  }

  picture.delete = function(PictureId, callback) {
    let result = new Promise((resolve, reject)=>{
      findById(PictureId)
      .then(result=>resolve(result))
      .catch(error=>reject(error));
    });
    result.then(file=>{
      deleteFile(file.name);
      deleteFile(file.nameSmall);
      deleteFile(file.nameThumbnail);
      picture.deleteById(PictureId, err => {
        if (err) {
          callback(err);
        } else {
          callback(null, PictureId);
        }
      });
    })
    .catch(error=>callback(error));
  };
  picture.remoteMethod(
    'delete',
    {
      http: {path: '/delete', verb: 'post'},
      accepts: [
        {arg: 'PictureId', type: 'string', required: true},
      ],
      returns: {arg: 'deleted', type: 'string'},
    }
  );
};

