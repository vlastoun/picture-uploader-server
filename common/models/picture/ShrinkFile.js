 var im = require('imagemagick');
 var fs = require('fs');
 /**
 * Private by naming convention
 * @param {object} file
 * @param {int} width
 * @param {string} suffix
 */
 module.exports = function shrinkFile(file, width = 300, suffix = 'shrinked') {
   return new Promise((resolve, reject)=>{
     im.resize({
       width: width,
       srcPath: file.path,
       dstPath: `${file.dstPath}${file.stamp}_${suffix}_${file.fileName}`,
     }, (err, stdout, stderr)=>{
       if (err) {
         fs.unlink(file.path, ()=>{
           resolve('not processable');
         });
       } else {
         let filename = `${file.stamp}_${suffix}_${file.fileName}`;
         resolve(filename);
       }
     });
   });
 };
