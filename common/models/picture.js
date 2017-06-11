// run generator
const co = require('co');
const PictureUploader = require('./picture/PictureUploader');
var CONTAINERS_URL = '/api/containers/';
var CONTAINER = 'pictures';

module.exports = function(picture) {
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
};

