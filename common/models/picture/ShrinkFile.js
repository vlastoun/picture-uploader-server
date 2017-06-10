 var im = require('imagemagick');
 /**
 * Private by naming convention
 * @param {object} file
 * @param {int} width
 * @param {string} suffix
 */
 module.exports = function shrinkFile(file, width = 300, suffix = 'shrinked') {
   return new Promise((reject, resolve)=>{
     im.resize({
       width: width,
       srcPath: file.path,
       dstPath: `${file.dstPath}${file.stamp}_${suffix}_${file.fileName}`,
     }, (err, stdout, stderr)=>{
       if (err) {
         reject(err);
       } else {
         resolve(file);
       }
     });
   });
 };
