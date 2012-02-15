var debug = require('debug')('getit'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    url = require('url'),
    reRemote = /^\w[\w\.\+\-]+\:\/\//,
    reStatusOK = /^(2|3)\d+/;
    
function getit(target, opts, callback) {
    // check for options being omitted
    if (typeof opts == 'function') {
        callback = opts;
        opts = {};
    }
    
    // initialise opts
    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();

    // check if the target looks like a remote target
    if (reRemote.test(target)) {
        // get the target url
        var targetUrl = getUrl(target);
        
        // make the request
        debug('requesting remote resource (' + targetUrl + '), for target: ' + target);
        request(targetUrl, function(err, res, body) {
            // ensure we have a response to work with
            res = res || {};
            
            if (! reStatusOK.test(res.statusCode)) {
                err = new Error((res.headers || {}).status || 'Not found');
            }
            
            if (callback) {
                callback(err, err ? null : body);
            }
        });
    }
    else {
        fs.readFile(path.resolve(opts.cwd, target), 'utf8', function(err, data) {
            if (callback) {
                callback(err, data);
            }
        });
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

exports = module.exports = getit;
exports.getUrl = getUrl;