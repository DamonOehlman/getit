/* jshint node: true */


const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const reCharset = /^.*charset\=(.*)$/;
const reInvalidCacheChars = /(\:\/+|\/+|\.(?!\w+$))/g;

/**
## getit cache helpers

### cache.get(target, opts, callback)
**/
exports.get = function(target, opts, callback) {
  let cacheData = {};
  let cacheFile;
  let metaFile;

  // if we have no cache folder, then trigger the callback with no data
  if (!opts.cachePath) {
    callback(cacheData);
  }
  // otherwise, look for an etag file
  else {
    cacheFile = path.resolve(opts.cachePath, getCacheTarget(target));
    metaFile = `${cacheFile}.meta`;

    // read the etag file
    fs.readFile(metaFile, 'utf8', (err, data) => {
      let match;
      let encoding;

      if (!err) {
        cacheData = JSON.parse(data);

        // look for an encoding specification in the metadata
        match = reCharset.exec(cacheData['content-type']);
        encoding = match ? match[1] : 'utf8';

        fs.readFile(cacheFile, encoding, (err, data) => {
          if (!err) {
            cacheData.data = data;
          }

          callback(cacheData);
        });
      } else {
        callback(cacheData);
      }
    });
  }
};

/**
### cache.update(target, opts, resErr, res, body, callback)
**/
exports.update = function(target, opts, resErr, res, body, callback) {
  let cacheFile;
  let meta;
  const cacheable = opts.cachePath && (!resErr) && res.headers &&
      (opts.cacheAny || res.headers.etag);

  // if not cacheable return
  if (!cacheable) {
    return callback();
  }

  // initialise the cache filename and metafile
  cacheFile = path.resolve(opts.cachePath, getCacheTarget(target));
  meta = `${cacheFile}.meta`;

  // do the caching thing
  mkdirp(opts.cachePath, (err) => {
    if (err) {
      return callback(err);
    }

    // create the metadata file
    fs.writeFile(meta, JSON.stringify(res.headers), 'utf8', () => {
      const match = reCharset.exec(res.headers['content-type']);
      const encoding = match ? match[1] : 'utf8';

      fs.writeFile(cacheFile, body, encoding, () => {
        callback();
      });
    });
  });
};

/* internals */

var getCacheTarget = exports.getTarget = function(target) {
  return target.replace(reInvalidCacheChars, '-');
};
