/**
  ### Github Includes (github://)

  ```js
  getit('github://DamonOehlman/getit/index.js', function(err, data) {
  });
  ```
**/
module.exports = (parts) => {
  const pathParts = parts.path.replace(/^\//, '').split('/');

  return `https://raw.githubusercontent.com/${parts.hostname}/${
    pathParts[0]}/master/${pathParts.slice(1).join('/')}`;
};
