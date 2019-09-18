const debug = require('debug')('getit-gist');

module.exports = (parts, original) => {
  let endpoint;

  debug(`running gist scheme remapper on: ${original}`, parts);

  // map the endpoint to the gist first of all
  endpoint = `https://gist.githubusercontent.com/${parts.hostname}/${parts.port}/raw`;
  // 'https://raw.github.com/gist/' + parts.host;

  // if a pathname has been extracted from the original url, then append
  // that to the request
  if (parts.path) {
    endpoint += `/${parts.path.replace(/^\//, '')}`;
  }

  return endpoint;
};
