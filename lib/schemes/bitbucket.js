/* jshint node: true */
'use strict';

module.exports = function(parts) {
  var pathParts = parts.pathname.replace(/^\//, '').split('/');

  return 'https://bitbucket.org/' + parts.host + '/' +
    pathParts[0] + '/raw/master/' + pathParts.slice(1).join('/');
};