# CancelablePromise

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/cancelable-promise) ![version](https://img.shields.io/npm/v/@nextgis/cancelable-promise)

A promise you can stop.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `CancelablePromise` will be registered as a global variable.

```html
<script src="../lib/cancelable-promise.global.js"></script>

<script>
  var promise = new CancelablePromise((resolve, reject, onCancel) => {
    setTimeout(resolve, 1000);
    onCancel(() => console.log('canceled'));
  });
  promise.cancel();
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/cancelable-promise"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/cancelable-promise"></script>
```

We recommend linking to a specific version number `/cancelable-promise@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/cancelable-promise
# or
$ yarn add @nextgis/cancelable-promise
```

## Usage

Catch `CancelError`

```javascript
import CancelablePromise from "@nextgis/cancelable-promise";

const promise = new CancelablePromise((resolve, reject) => {
  setTimeout(() => resolve(), 100);
}).catch((er) => {
  if (er.name === "CancelError") {
    // handle cancel error
  }
  throw er;
});

promise.cancel();
```

Handle `onCancel` callback

```javascript
import CancelablePromise from "@nextgis/cancelable-promise";

const promise = new CancelablePromise((resolve, reject, onCancel) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = () => {
    resolve(xhr.responseText);
  };
  xhr.onerror = (er) => {
    reject(er);
  };

  onCancel(() => {
    xhr.abort();
  });

  xhr.send();
});

promise.cancel();
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/cancelable_promise.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cancelable-promise`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
