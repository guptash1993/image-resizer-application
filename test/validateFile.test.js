const validateFile = require('../src/validateFile');

test('filename without extension', async () => {
  const result = validateFile('nodejspng');
  expect(result.error).toBe(true);
  expect(result.message).toBe('File name does not contain extension');
});

test('check invalid filename', async () => {
  
  const result = validateFile('.png');
  expect(result.error).toBe(true);
  expect(result.message).toBe('File name is not valid');
});

test('check invalid file extension', async () => {
  
  const result = validateFile('nodejs.');
  expect(result.error).toBe(true);
  expect(result.message).toBe('File extension is not valid');
});

test('check valid but file name but file does not exist', async () => {
  const result = validateFile('nodejs.jpg');
  expect(result.error).toBe(true);
  expect(result.message).toBe('Filename does not exist');
});

test('check valid and existing file name', async () => {
  const result = validateFile('nodejs.png');
  expect(result.error).toBe(false);
  expect(result.message).toBe('Filename is valid');
});