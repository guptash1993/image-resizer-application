const fs = require('fs');
const sharp = require('sharp');
var _ = require('lodash');

module.exports = function resize(filename, width, height, id, callback) {

  const format = filename.slice(filename.indexOf('.')+1);

	let transform = sharp();
  transform = transform.toFormat(format).resize(width, height);


  const readStream = fs.createReadStream('./asset/' + filename);

  const targetFile = 'file-'+id;
  const writableStream = fs.createWriteStream('./temp/'+targetFile);
  writableStream.on('finish', () => {
    callback(false, targetFile);
  }); 

  writableStream.on('error', () => {
    callback(true, '');
  });     

  readStream.pipe(transform).pipe(writableStream);
}