/* jshint node: true */
'use strict';

module.exports = function(parts) {
  return 'https://' + parts.host + '.googlecode.com/' +
    parts.pathname.replace(/^\//, '');
};