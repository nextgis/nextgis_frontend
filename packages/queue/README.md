# Cache

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/queue) ![version](https://img.shields.io/npm/v/@nextgis/queue)

An advanced promise queue management library for JavaScript.
This library is designed to handle the concurrency of any asynchronous tasks encapsulated in promises, providing optional debouncing to manage the flow of promise execution.

- Limit the number of concurrent promises.
- Optional debouncing to manage the timing of promise execution.
- Ability to abort queued promises.
- Efficient and orderly management of asynchronous operations.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Queue` will be registered as a global variable.

```html
<script src="../lib/queue.global.js"></script>

<script>
const queue = new Queue({ concurrency: 3, delay: 200 });

const asyncTask = function () {
  return new Promise((resolve) => setTimeout(() => resolve("Task Complete"), 1000));
};

queue.add(asyncTask);


const asyncWithAbort = () => {
  let timer;
  const promise = new Promise((resolve) => {
    timer = setTimeout(() => resolve("Another Task Complete"), 500);
  });
  const abortFunc = () => {
    clearTimeout(timer);
    console.log('Task was aborted');
  };
  return [promise, abortFunc]
}

queue.add(asyncWithAbort);
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/queue"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/queue"></script>
```

We recommend linking to a specific version number `/queue@[version]`

### In Node.js

```bash
npm install @nextgis/queue
```

## Usage

```javascript
import Queue from '@nextgis/queue';

const queue = new Queue({ concurrency: 2, delay: 100 });

const abortController = new AbortController();

queue.add(
  () =>
    fetch('https://api.example.com/data', {
      signal: abortController.signal,
    }),
  abortController.abort,
);

// Demonstrating the abort function
setTimeout(() => {
  queue.abort();
}, 100);
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_cache.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cache`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
