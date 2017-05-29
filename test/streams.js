const assert = require('assert');
const fs = require('fs');
const path = require('path');
const getit = require('../');

const testfile = path.resolve(__dirname, 'test.txt');
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

  it('should be able to stream a download', (done) => {
    const stream = getit('github://DamonOehlman/getit/test/files/test.txt', opts);

    stream.pipe(fs.createWriteStream(testfile));
    stream.on('end', () => {
      fs.readFile(testfile, 'utf8', (err, data) => {
        assert.ifError(err);
        assert.equal(data, testContent);

        done();
      });
    });
  });

  after((done) => {
    fs.unlink(testfile, done);
  });
});
