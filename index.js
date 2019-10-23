const express = require('express')
const spec = require('./src/spec.js')
const validateFile = require('./src/validateFile.js')
const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./src/schedular'));
const fs = require('fs');

const server = express()
const port = spec.PORT;

server.get('/thumbnail', (req, res) => {
  const file = req.query.filename;
  generateThumbnail(file,res);
})

server.get('/status', (req, res) => {
  let id = req.query.id;
  checkStatus(id, res);
})

function generateThumbnail(file, res){
  const widthString = spec.WIDTH;
  const heightString = spec.HEIGHT;
  // Parse the size parameters to integer if possible
  let width, height
  if (widthString) {
    width = parseInt(widthString)
  }
  if (heightString) {
    height = parseInt(heightString)
  }
  
  //check valid file or not
  const response = validateFile(file);
  if(response.error) {
    res.send(response);
    return;
  }

  const thumbnailid = spec.ID_COUNTER++;

  setIdStatus(thumbnailid, status.processingStatus);

  const input = {
    filename: file,
    width: width,
    height: height,
    id: thumbnailid 
  }

  workers(input, function (err, outp) {
    if(err){
      setIdStatus(thumbnailid, status.errorStatus);
      return;
    }
    setIdStatus(thumbnailid, status.finishedStatus);
  })

  res.send({
    id: thumbnailid,
    status: status.processingStatus
  })
}

//Status Management for an ID
const status = {
    processingStatus: 'PROCESSING',
    finishedStatus: 'FINISHED',
    errorStatus: 'ERROR'
}
let idMap = {};

function setIdStatus(id, state) {
    idMap[id] = state;
}

function getIdStatus(id) {
    return  idMap[id];
}

function checkStatus(id, res) {
  let response = {
  }

  if(!id){
    response.status = 'ERROR';
    response.message = 'ID should be mandatory';
    res.send(response);
    return;
  }

  if(isNaN(id)){
    response.status = 'ERROR';
    response.message = 'ID should be a number';
    res.send(response);
    return;  
  }

  id = parseInt(id);

  const idStatus = getIdStatus(id);

  if(!idStatus) {
    response.status = 'ERROR';
    response.message = 'ID is not registered';
    res.send(response);
    return;
  }

  response.status = idStatus;


  if(idStatus == status.finishedStatus){
    var readStream = fs.createReadStream('./temp/file-'+id);
    readStream.pipe(res);
  }else{
    res.send(response);
  }
}

const app = server.listen(port, () => {
  const tmpPath = './temp';
  if( fs.existsSync(tmpPath) ) {
    fs.readdirSync(tmpPath).forEach(function(file,index){
      var curPath = tmpPath + "/" + file;
      fs.unlinkSync(curPath);
    });
    fs.rmdirSync(tmpPath);
  }
  fs.mkdirSync(tmpPath);
})

module.exports = {
    generateThumbnail,
    checkStatus,
    app
}