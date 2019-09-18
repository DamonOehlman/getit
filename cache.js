const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

const reCharset = /^.*charset=(.*)$/;
const reInvalidCacheChars = /(:\/+|\/+|\.(?!\w+$))/g;

const get = (target, opts, callback) => {
  let cacheData = {};

  // if we have no cache folder, then trigger the callback with no data
  if (!opts.cachePath) {
    callback(cacheData);
  } else {
    const cacheFile = path.resolve(opts.cachePath, getCacheTarget(target));
    const metaFile = `${cacheFile}.meta`;

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

const update = (target, opts, resErr, res, body, callback) => {
  const cacheable = opts.cachePath
    && (!resErr)
    && res.headers
    && (opts.cacheAny || res.headers.etag);

  // if not cacheable return
  if (!cacheable) {
    return callback();
  }

  // initialise the cache filename and metafile
  const cacheFile = path.resolve(opts.cachePath, getCacheTarget(target));
  const meta = `${cacheFile}.meta`;

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

const getCacheTarget = target => target.replace(reInvalidCacheChars, '-');

module.exports = {
  get,
  update,
  getCacheTarget
};
