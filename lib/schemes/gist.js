var debug = require('debug')('getit-gist');

module.exports = function(parts, original) {
    var endpoint;
    
    debug('running gist scheme remapper on: ' + original, parts);
    
    // map the endpoint to the gist first of all
    endpoint = 'https://raw.github.com/gist/' + parts.host;
    
    // if a pathname has been extracted from the original url, then append that to the request
    if (parts.pathname) {
        endpoint += '/' + parts.pathname.replace(/^\//, '');
    }
    
    return endpoint;
};