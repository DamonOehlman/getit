const assert = require('assert');
const fs = require('fs');
const path = require('path');
const getit = require('../');

const opts = {
  cwd: __dirname
};

describe('local loading test', () => {
  let testContent = '';

  before((done) => {
    fs.readFile(path.resolve(__dirname, 'files/test.txt'), 'utf8', (err, data) => {
      if (!err) {
        testContent = data;
      }

      done(err);
    });
  });

  it('should be able to load a local file', (done) => {
    getit('files/test.txt', opts, (err, data) => {
      assert.ifError(err);
      assert.equal(data, testContent);
      done(err);
    });
  });

  it('should be able to load a remote file', (done) => {
    getit('github://DamonOehlman/getit/test/files/test.txt', opts, (err, data) => {
      assert.equal(data, testContent);
      done(err);
    });
  });

  it('should return an error for a non-existant remote file', (done) => {
    getit('github://DamonOehlman/getit/test/files/test2.txt', opts, (err) => {
      assert(err);
      done();
    });
  });
});
