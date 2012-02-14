var reRemote = /^\w[\w\.\+\-]+\:\/\//,
    request = require('request'),
    url = require('url');
    

function getit(target, opts) {
    // initialise opts
    opts = opts || {};
    opts.basePath = opts.basePath || process.cwd();

    // check if the target looks like a remote target
    if (reRemote.test(target)) {
        var targetUrl = getUrl(target);
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