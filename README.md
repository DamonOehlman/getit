# getit

This is a simple remote file loader that makes it easy to open both local
and remote files in a simple (and consistent) way.  Behind the scenes getit
uses [hyperquest](https://github.com/substack/hyperquest) module to to the
heavy lifting.

[![NPM](https://nodei.co/npm/getit.png)](https://nodei.co/npm/getit/)

[![stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/dominictarr/stability#stable) [![Build Status](https://api.travis-ci.org/DamonOehlman/getit.svg?branch=master)](https://travis-ci.org/DamonOehlman/getit) [![Maintainability](https://api.codeclimate.com/v1/badges/e34775d145b1886389b8/maintainability)](https://codeclimate.com/github/DamonOehlman/getit/maintainability)

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

### Specifying the Current Working Directory

By default, all files are resolved to the current working directory through
using `path.resolve`. The default directory resolved against can be
overriden, however, by passing options to the `getit` function call:

```js
getit('files/test.txt', { cwd: __dirname }, function(err, data) {

});
```

Specifying the `cwd` option has no effect on remote requests, but there
might be other options added in time to tweak the default
hyperquest behaviour eventually.  The general principle is you should be
able to use `getit` to get the content of both local and remote resources
without having to dramatically change the way you use the library.

## GetIt Options

The `getit` function supports a second argument for providing options to
change the default getit behaviour.

### Caching use   `cachePath`

If you provide an optional `cachePath`, then getit will cache a copy of
the data retrieved in the specified path.  In addition to the data
retrieved, an [etag](http://en.wikipedia.org/wiki/HTTP_ETag) value will
be stored in a lookup file.  This will be used in subsequent lookups
using the `If-None-Match` header.

By default, caching will only occur on a server that provides an etag
value, but this can be overridden by also setting the `cacheAny`
option to true.

```js
var opts = {
  cachePath: '/tmp'
};

getit(
  'github://DamonOehlman/getit/test/files/test.txt',
  opts,
  function(err, data) {

  }
);
```

Finally, if you would prefer not to wait around for a HTTP request and
a `304` response, then you can provide the `preferLocal` option always
used the cached copy of a file if it exists in the cache folder.

### Aggressive caching with   `preferLocal`

If you **really** want to avoid a round-trip to web servers to check the
freshness of the cache, then it might be worth using the `preferLocal`
option also.  This instructs getit to skip the `etag` check if it finds
the required file in the cache directory.

If you do decide to implement this functionality, it's recommended that
you provide some option in your application to allow users to clear the
local cache path.

## getit cache helpers

### cache.get(target, opts, callback)

### cache.update(target, opts, resErr, res, body, callback)

## Custom URL Schemes

Getit supports a number of custom url schemes to help you type less
characters:

### Contributing URL Schemes

The task of the scheme translator is to convert a url of the custom scheme
into a standard URI that can be passed to the GET.

To create your own scheme translator simply fork the library,
decide on the scheme / protocol prefix (e.g. github, flickr, etc) and
then create the relevant translator in the `lib/schemes` directory.
When `getit` encounters a request for a url matching your custom scheme
translator will be required and involved before actually requesting the url.

Simple.

### Github Gists (gist://)

To get the default file (first file) from a particular gist:

```js
getit('gist://DamonOehlman:6999398', function(err, content) {
});
```

To get a specific file from a particular gist:

```js
getit('gist://DamonOehlman:6877717/index.js', function(err, content) {
});
```

**NOTE:** Github recently changed the way gist raw urls were formatted
which has meant a change is needed in the getit format.  You must now also
include the username of the owner of the gist when requesting the file
as shown in the examples above.

### Github Includes (github://)

```js
getit('github://DamonOehlman/getit/index.js', function(err, data) {
});
```

## Licence

The MIT License (MIT)

Copyright (c) 2019 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
