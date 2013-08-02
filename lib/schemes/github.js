/* jshint node: true */
'use strict';

/**
  ### Github Includes (github://)

  ```js
  getit('github://DamonOehlman/getit/index.js', function(err, data) {
  });
  ```
**/
module.exports = function(parts) {
  var pathParts = parts.pathname.replace(/^\//, '').split('/');
  
  return 'https://raw.github.com/' + parts.host + '/' +
    pathParts[0] + '/master/' + pathParts.slice(1).join('/');
};