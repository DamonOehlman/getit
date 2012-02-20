var debug = require('debug')('getit'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    url = require('url'),
    reRemote = /^\w[\w\.\+\-]+\:\/\//,
    reStatusOK = /^(2|3)\d+/,
    reAlias = /^(\w+)\!(.*)$/,
    reTrailingSlash = /\/$/,
    reLeadingSlash = /^\//;
    
function getit(target, opts, callback) {
    // check for options being omitted
    if (typeof opts == 'function') {
        callback = opts;
        opts = {};
    }
    
    // initialise opts
    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();
    opts.aliases = opts.aliases || {};

    // expand aliases
    target = expandAliases(target, opts.aliases);

    // check if the target looks like a remote target
    if (isRemote(target)) {
        // get the target url
        var targetUrl = getUrl(target);
        
        // make the request
        if (callback) {
            debug('requesting remote resource (' + targetUrl + '), for target: ' + target);
            request(targetUrl, function(err, res, body) {
                debug('received response for target: ' + target);

                // ensure we have a response to work with
                res = res || {};

                if (! reStatusOK.test(res.statusCode)) {
                    err = new Error((res.headers || {}).status || 'Not found');
                }

                callback(err, err ? null : body);
            });
            
            return null;
        }
        else {
            return request(targetUrl);
        }
    }
    else {
        var targetFile = path.resolve(opts.cwd, target);

        // if a callback is defined, then read the file using the fs.readFile function
        if (callback) {
            debug('reading file: ' + targetFile);
            fs.readFile(targetFile, 'utf8', function(err, data) {
                debug('read file: ' + targetFile + ', err: ' + err);

                callback(err, data);
            });
            
            return null;
        }
        // otherwise, return a read file stream
        else {
            return fs.createReadStream(targetFile);
        }
    }
}

function getUrl(target) {
    var parts = url.parse(target),
        scheme = parts.protocol.slice(0, parts.protocol.length - 1),
        translator;
        
    // try and include the scheme translator
    try {
        translator = require('./schemes/' + scheme);
    }
    catch (e) {
        // no translator found, leave the handler blank
    }
    
    // if we have a translator, then use it
    if (translator) {
        target = translator(parts, target);
    }
    
    // return the target
    return target;
}

function expandAliases(target, aliases) {
    aliases = aliases || {};
    
    // if the target is an aliases, then construct into an actual target
    if (reAlias.test(target)) {
        var base = (aliases[RegExp.$1] || '').replace(reTrailingSlash, '');
        
        // update the target
        target = base + '/' + RegExp.$2.replace(reLeadingSlash, '');
    }
    
    return target;
}

function isRemote(target, opts) {
    return reRemote.test(target);
}

exports = module.exports = getit;
exports.getUrl = getUrl;
exports.expandAliases = expandAliases;
exports.isRemote = isRemote;