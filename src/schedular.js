const resize = require('./resize')

module.exports = function (input, callback) {
  console.log('Processing file ' + input.filename + ' with the process id: ' + process.pid);
  resize(input.filename, input.width, input.height, input.id, callback);
}