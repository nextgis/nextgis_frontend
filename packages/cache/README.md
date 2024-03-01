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

  console.log(cache.match('test')); // 'value'

  var makeRequest = function () {
    return request('url', { method: 'GET' });
  };
  cache.add('promise-test', makeRequest, { method: 'GET' });

  console.log(cache.match('test') instanceof Promise); // true
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

// Cache simple value
const cache = new Cache();
cache.add('test', 'value');

console.log(cache.match('test')); // 'value'

// Cache is global
const cache2 = new Cache();
console.log(cache.match('test')); // 'value'

// Use callback functions to add promises to the cache

// on add cache a promise from callback will be returned
const onAdd = cache.add('test1', () => new Promise((res) => res('ok')));
console.log(onAdd instanceof Promise); // true
onAdd.then((data) => console.log(data)); // 'ok'

// callback need to protect promise from re-running if cache already set.
let callCount = 0;
const makePromise = function () {
  return new Promise((resolve) => {
    resolve(callCount++);
  });
};
Promise.all(() => [
  cache.add('key', makePromise),
  cache.add('key', makePromise, { id: 1 }),
  cache.add('key', makePromise, { id: 1 }),
  cache.add('key', makePromise, { id: 2 }),
  cache.add('key', makePromise, { id: 2 }),
]).then((resp) => {
  console.log(resp); // [0, 1, 1, 2, 2]
});

const fromCache = cache.match('key', { id: 1 });
console.log(fromCache instanceof Promise); // true
fromCache.then(function (resp) {
  console.log(resp);
});

// Match all promises from cache by key

cache.add('key', makePromise); // added to cache
cache.add('key', makePromise, { id: 1 }); // added to the cache
cache.add('key', makePromise, { id: 1 }); // NOT added to the cache
cache.add('key', makePromise, { id: 2 }); // added to the cache
cache.add('key', makePromise, { id: 2 }); // NOT added to the cache
Promise.all(cache.matchAll('key')).then((resp) => {
  return console.log(resp); // [3, 4, 5]
});

// With cancelable promise
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

Check out the [API Documentation](https://code-api.nextgis.com/modules/cache.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cache`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
