const debug = require('debug')('getit');
const fs = require('fs');
const path = require('path');
const request = require('hyperquest');
const urlish = require('urlish');

// regexes
const reRemote = /^\w[\w.+-]+:\/\//;
const reStatusCached = /^304$/;
const reStatusOK = /^(2|3)\d+/;

// cache helpers
const cache = require('./cache');

const getit = (target, opts, callback) => {
  // check for options being omitted
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  // initialise opts
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();

  // if not a remote url, then get local
  if (!isRemote(target)) {
    return getLocal(target, opts, callback);
  }

  // get the target url
  const targetUrl = getUrl(target);

  // initialise the request opts
  const requestOpts = {
    method: 'GET',
    uri: targetUrl
  };

  // if we don't have a callback, return a request stream
  if (!callback) {
    debug(`creating stream for retrieving: ${targetUrl}`);
    return request(requestOpts);
  }

  // check the cache
  cache.get(target, opts, (cacheData) => {
    // if we have cache data then add the if-none-match header
    if (cacheData.etag) {
      requestOpts.headers = {
        'If-None-Match': cacheData.etag
      };
    }

    // if we have cache data and prefer local is set, then return that data
    if (opts.preferLocal && cacheData.data) {
      return callback(null, cacheData.data);
    }

    debug(`requesting resource: ${targetUrl}, for target: ${target}`);
    request(requestOpts)
      // handle the response
      .on('response', (res) => {
        let body = '';

        debug(`received response for target: ${target}`);
        // if cached, then return the catched content
        if (reStatusCached.test(res.statusCode)) {
          return callback(null, cacheData.data, true);
        }

        // otherwise, if not ok, then return an error
        if (!reStatusOK.test(res.statusCode)) {
          return callback(`${new Error(((res.headers || {}).status ||
            'Not found'))}: ${targetUrl}`);
        }

        // otherwise, proceed to download the content
        res.on('data', (buffer) => {
          body += buffer.toString('utf8');
        });

        res.on('end', () => {
          cache.update(target, opts, null, res, body, () => {
            callback(null, body);
          });
        });
      })
      .on('error', callback);
  });

  return null;
};

const getLocal = (target, opts, callback) => {
  const targetFile = path.resolve(opts.cwd, target);

  // if we don't have a callback, return a stream
  if (!callback) {
    return fs.createReadStream(targetFile);
  }

  // if a callback is defined, then read the file using the
  debug(`reading file: ${targetFile}`);
  fs.readFile(targetFile, 'utf8', (err, data) => {
    debug(`read file: ${targetFile}, err: ${err}`);

    callback(err, data);
  });

  return null;
};

const getUrl = (target) => {
  const parts = urlish(target);
  let translator;

  // if we have no parts, just return the target
  if (!parts) {
    return target;
  }

  // try and include the scheme translator
  try {
    translator = require(`./lib/schemes/${parts.scheme}`);
  } catch (e) {
    // no translator found, leave the handler blank
  }

  // if we have a translator, then use it
  if (translator) {
    target = translator(parts, target);
  }

  // return the target
  return target;
};

const isRemote = target => reRemote.test(target);

getit.getLocal = getLocal;
getit.getUrl = getUrl;
getit.getCacheTarget = cache.getCacheTarget;
getit.isRemote = isRemote;

module.exports = getit;
