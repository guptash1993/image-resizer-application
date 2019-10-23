const index = require('../index');
const spec = require('../src/spec.js')

test('generate a single thumbnail', async () => {

  let response;
  const res = {
    send: function(val){
      response = val;
    }
  }
  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(1);
  expect(response.status).toBe('PROCESSING');
});

test('generate continous thumbnail', async () => {

  spec.ID_COUNTER= 1;

  let response;
  let res = {
    send: function(val){
      response = val;
    }
  };

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(1);
  expect(response.status).toBe('PROCESSING');

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(2);
  expect(response.status).toBe('PROCESSING');

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(3);
  expect(response.status).toBe('PROCESSING');

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(4);
  expect(response.status).toBe('PROCESSING');

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(5);
  expect(response.status).toBe('PROCESSING');

  index.generateThumbnail('nodejs.png', res);
  expect(response.id).toBe(6);
  expect(response.status).toBe('PROCESSING');
});

test('test check status with non numeric Id', async () => {

  let response;
  const res = {
    send: function(val){
      response = val;
    }
  }

  index.checkStatus('abc', res);
  expect(response.status).toBe('ERROR');
  expect(response.message).toBe('ID should be a number');
});

test('test check status without id', async () => {
  let response;
  const res = {
    send: function(val){
      response = val;
    }
  }

  index.checkStatus(null, res);
  expect(response.status).toBe('ERROR');
  expect(response.message).toBe('ID should be mandatory');
});

test('test check status with non registered id', async () => {
  let response;
  const res = {
    send: function(val){
      response = val;
    }
  }

  index.checkStatus('24', res);
  expect(response.status).toBe('ERROR');
  expect(response.message).toBe('ID is not registered');
});

afterAll( async () => {
  await index.app.close();
});