require('dotenv').config();
/* eslint-disable camelcase */
module.exports = function(Cloudinary) {
  const cloudinary = require('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDI_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  /**
 * delete image from database cloudinary
 * @param {string} imageId id of image to delete
 * @param {Function(Error)} callback
 */

  Cloudinary.deleteImage = function(imageId, callback) {
    Cloudinary.find({where: {'public_id': imageId}}, (err, data)=>{
      data.forEach((item)=>{
        Cloudinary.destroyById(item.id);
        cloudinary.uploader.destroy(item.public_id, (result)=>{
          console.log('cloudinary deleted', result);
        });
      });
    });
    callback(null, {status: 'OK'});
  };
};
