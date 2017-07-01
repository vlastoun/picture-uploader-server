/* eslint-disable camelcase */
require('dotenv').config();
module.exports = function(app) {
  const cloudinary = require('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDI_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  const Post = app.models.post;
  const Pic = app.models.cloudinary;
  Post.observe('after delete', (ctx, next)=>{
    Pic.find({where: {postId: ctx.where.id}}, (err, data)=>{
      data.forEach((item)=>{
        Pic.destroyById(item.id);
        cloudinary.uploader.destroy(item.public_id, (result)=>{
          console.log('cloudinary deleted', result);
        });
      });
    });
    next();
  });
};
