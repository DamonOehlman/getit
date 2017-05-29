const assert = require('assert');
const fs = require('fs');
const path = require('path');
const getit = require('../');

const opts = {
  cwd: __dirname
};

describe('streamed download test', () => {
  let testContent = '';

  before((done) => {
    fs.readFile(path.resolve(__dirname, 'files/test.txt'), 'utf8', (err, data) => {
      if (!err) {
        testContent = data;
      }

      done(err);
    });
  });

  it('should be able to get a local file', (done) => {
    getit('files/test.txt', opts, (err, data) => {
      assert.ifError(err);
      assert.equal(data, testContent);

      done();
    });
  });
});
