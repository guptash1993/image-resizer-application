const fs = require('fs');

module.exports = function validateFile(filename) {

  const extensionIndex = filename.indexOf('.');
  if(extensionIndex <0) {
    return status('File name does not contain extension', true);
  }

  const fileName = filename.slice(0, extensionIndex);

  //Check valid filename
  if(!fileName) {
    return status('File name is not valid', true);
  }

  //Check valid fileExtension
  const fileExtension = filename.slice(extensionIndex+1);
  if(!fileExtension) {
    return status('File extension is not valid', true);
  }

  //Check fileexist
  const filePath = './asset/' + filename;

  try {
    if (fs.existsSync(filePath)) {
      //file exists
      return status('Filename is valid', false);
    }else{
      return status('Filename does not exist', true);
    }
  } catch(err) {
    return status('Error in opening file', true);
  }  

}

function status(message, error){
  return {
    error: error,
    message: message
  }
}