# Cancelable Promise

A promise you can stop.

## Installation

```bash
# latest stable
$ npm install --save-dev @nextgis/cancelable-promise
# or
$ yarn add @nextgis/cancelable-promise
```

## Usage

Catch `CancelError'

```js
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

```js
import CancelablePromise from "@nextgis/cancelable-promise";

const promise = new CancelablePromise((resolve, reject, onCancel) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    resolve();
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

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cancelable-promise`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
