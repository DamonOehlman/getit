/* jshint node: true */
'use strict';

var debug = require('debug')('getit-gist');

/**
### Github Gists (gist://)

To get the default file (first file) from a particular gist:

```js
getit('gist://3344823', function(err, content) {
});
```

To get a specific file from a particular gist:

```js
getit('gist://1261033/bridge-server.js', function(err, content) {
});
```
**/
module.exports = function(parts, original) {
  var endpoint;
  
  debug('running gist scheme remapper on: ' + original, parts);
  
  // map the endpoint to the gist first of all
  endpoint = 'https://raw.github.com/gist/' + parts.host;
  
  // if a pathname has been extracted from the original url, then append
  // that to the request
  if (parts.pathname) {
    endpoint += '/' + parts.pathname.replace(/^\//, '');
  }
  
  return endpoint;
};