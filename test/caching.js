const assert = require('assert');
const fs = require('fs');
const path = require('path');
const getit = require('../');
const rimraf = require('rimraf');

const cacheFolder = path.resolve(__dirname, '_cache');
const target = 'github://DamonOehlman/getit/test/files/test.txt';
const cacheFile = path.join(cacheFolder, getit.getCacheTarget(target));
const metaFile = `${cacheFile}.meta`;
const cacheTextOverride = 'cached_text';

describe('caching tests', () => {
  let testContent = '';
  before((done) => {
    fs.readFile(path.resolve(__dirname, 'files/test.txt'), 'utf8', (err, data) => {
      if (!err) {
        testContent = data;
      }

      done(err);
    });
  });

  before((done) => {
    rimraf(cacheFolder, done);
  });

  it('should be able to create a filename suitable for caching', () => {
    assert.equal(getit.getCacheTarget(target), 'github-DamonOehlman-getit-test-files-test.txt');
  });

  it('should be able to get the non-cached version of the file', (done) => {
    getit(target, { cachePath: cacheFolder }, (err, data) => {
      assert.ifError(err);
      assert.equal(data, testContent);
      done(err);
    });
  });

  it('should have created a cache file', (done) => {
    fs.readFile(cacheFile, 'utf8', (err, data) => {
      assert.ifError(err);
      assert.equal(data, testContent);

      done(err);
    });
  });

  it('should have created an metadata file', (done) => {
    fs.readFile(metaFile, 'utf8', (err) => {
      done(err);
    });
  });

  it('should used the cached file if we have an etag match', (done) => {
    // update the cache file with content that we can test
    fs.writeFile(cacheFile, cacheTextOverride, 'utf8', (writeError) => {
      if (writeError) {
        done(writeError);
        return;
      }

      getit(target, { cachePath: cacheFolder }, (err, data, cached) => {
        assert.ifError(err);
        assert.equal(data, cacheTextOverride);
        assert(cached, 'Cached flag not set');

        done(err);
      });
    });
  });

  it('should be able to cache a file locally', (done) => {
    done();
  });
});
