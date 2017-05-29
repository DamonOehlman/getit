const assert = require('assert');
const getit = require('..');

describe('bitbucket scheme test', () => {
  let testContent;

  before((done) => {
    getit('https://bitbucket.org/puffnfresh/roy/raw/master/README.md', (err, content) => {
      testContent = content;
      done(err);
    });
  });

  it('should be able to download a file using the bitbucket scheme', (done) => {
    getit('bitbucket://puffnfresh/roy/README.md', (err, content) => {
      assert.ifError(err);
      assert.equal(content, testContent);

      done(err);
    });
  });
});
