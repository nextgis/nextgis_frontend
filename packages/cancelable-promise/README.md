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

```js
import CancelablePromise from '@nextgis/cancelable-promise';

const promise = new CancelablePromise((resolve, reject) => {
    setTimeout(() => resolve(), 100)
}).catch((er) => {
    if (er.name === 'CancelError') {
        // handle cancel error
    }
    throw er;
});

promise.cancel()

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cancelable-promise`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
