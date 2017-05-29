const assert = require('assert');
const getit = require('../');

describe('gist scheme test', () => {
  let snippet1 = '';
  let snippet2 = '';

  before((done) => {
    getit('https://gist.githubusercontent.com/DamonOehlman/6999398/raw', (err, content) => {
      snippet1 = content;
      done(err);
    });
  });

  before((done) => {
    getit('https://gist.githubusercontent.com/DamonOehlman/6877717/raw/index.js', (err, content) => {
      snippet2 = content;
      done(err);
    });
  });

  it('should get the first file by gist id only', (done) => {
    getit('gist://DamonOehlman:6999398', (err, content) => {
      assert.ifError(err);
      assert.equal(content, snippet1);

      done(err);
    });
  });

  it('should get a specified file when specified', (done) => {
    getit('gist://DamonOehlman:6999398/Makefile', (err, content) => {
      assert.ifError(err);
      assert.equal(content, snippet1);

      done(err);
    });
  });

  it('should error when a non-existant file is requested', (done) => {
    getit('gist://DamonOehlman:6999398/test.js', (err) => {
      assert(err);
      done();
    });
  });

  it('should get a specified file when the gist has more than one file', (done) => {
    getit('gist://DamonOehlman:6877717/index.js', (err, content) => {
      assert.ifError(err);
      assert.equal(content, snippet2);

      done();
    });
  });
});
