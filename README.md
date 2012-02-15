# GetIt

This is a simple remote file loader that makes it easy to open both local and remote files in a simple (and consistent) way.  

## Example Usage

Getting a file:

```js
getit('files/test.txt', function(err, data) {
    
});
```

Getting some online content:

```js
getit('http://www.google.com/', function(err, data) {
    
});
```

## Custom URL Schemes

Similar code to this has been implemented in the JS build tool [Interleave](https://github.com/DamonOehlman/interleave) and will eventually be replaced by integrating getit instead.  For this reason some helper URI schemes have been added.

### Github Includes (github://)

```js
getit('github://DamonOehlman/getit/index.js', function(err, data) {
});
```