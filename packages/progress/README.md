# Progress

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/progress) ![version](https://img.shields.io/npm/v/@nextgis/progress)

Tracking the progress of asynchronous operations.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Progress` will be registered as a global variable.

```html
<script src="../lib/progress.global.js"></script>

<script>
  var progress = new Progress();
  progress.emitter.on('stop', function () {
    console.log('STOP LOADING')
  })
  progress.addLoading();
  progress.addLoaded();
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/progress"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/progress"></script>
```

We recommend linking to a specific version number `/progress@[version]`

### In Node.js

```bash
npm install @nextgis/progress
```

## Usage

```javascript
import Progress from '@nextgis/progress';

const progress = new Progress();

// emitted when the first loader is added
progress.emitter.on('start', () => {

});
// emitted when the last loader is removed
progress.emitter.on('stop', () => {

});
// emitted on each loader is added
progress.emitter.on('add', () => {

});
// emmitted on each loader is removed
progress.emitter.on('remove', () => {

});

progress.addLoading();
fetch(url).finally(() => {
  progress.addLoaded();
})

```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_progress.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/progress`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
