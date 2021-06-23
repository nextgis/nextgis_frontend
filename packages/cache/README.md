# Cache

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/cache) ![version](https://img.shields.io/npm/v/@nextgis/cache)

Caching for asynchronous functions

- store key / value;
- store key, options / value (for example, for one url but for different methods);
- store promises;
- do not launch a promise for execution if there is already an unfulfilled promise for this key in the storage, the answer will be general;
- works with canceled promises;

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Cache` will be registered as a global variable.

```html
<script src="../lib/cache.global.js"></script>

<script>
  var cache = new Cache();
  cache.add('test', 'value');

  console.log(cache.match('test')); // value

  var callCount = 0;
  var makeRequest = function () {
    callCount++;
    return request.get(url);
  };
  cache.add(url, makeRequest);
  cache.add(url, makeRequest, { id: 1 });
  cache.add(url, makeRequest, { id: 1 });
  cache.add(url, makeRequest, { id: 2 });
  var onAdd = cache.add(url, makeRequest, { id: 2 });

  console.log(callCount); // 3

  onAdd.then(function (resp) {
    console.log(resp);
  });
  var fromCache = cache.match(url, { id: 1 });
  console.log(romCache instanceof Promise); // true
  fromCache.then(function (resp) {
    console.log(resp);
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/cache"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/cache"></script>
```

We recommend linking to a specific version number `/cache@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/cache
# or
$ yarn add @nextgis/cache
```

## Usage

```javascript
import Cache from '@nextgis/cache';

import { sleep } from '@nextgis/utils';
import CancelablePromise from '@nextgis/cancelable-promise';

const cache = new Cache();
cache.add('test', 'value');

console.log(cache.match('test')); // value

const callCount = 0;
const makeRequest = function () {
  callCount++;
  return request.get(url);
};
cache.add(url, makeRequest);
cache.add(url, makeRequest, { id: 1 });
cache.add(url, makeRequest, { id: 1 });
cache.add(url, makeRequest, { id: 2 });
const onAdd = cache.add(url, makeRequest, { id: 2 });

console.log(callCount); // 3

onAdd.then(function (resp) {
  console.log(resp);
});
const fromCache = cache.match(url, { id: 1 });
console.log(romCache instanceof Promise); // true
fromCache.then(function (resp) {
  console.log(resp);
});

// with cancelable promise

const cache = new Cache();
const cb = () => {
  return new CancelablePromise((resolve) =>
    sleep(30).then(() => resolve('test')),
  );
};
const onAdd = cache.add('test', cb);
const fromCache = cache.match('test');
console.log(onAdd instanceof CancelablePromise); // true
console.log(fromCache instanceof CancelablePromise); // true
onAdd.catch((er) => {
  if (er.name === 'CancelError') {
    // if a promise fails, the cache is not filled
    const fromCacheOnCancel = cache.match('test');
    if (!fromCacheOnCancel) {
      console.log('Done'); // Done
    }
  }
});
onAdd.cancel();
```

Check out the [API Documentation](https://github.com/nextgis/nextgis_frontend/blob/master/markdown/cache.md)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cache`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
