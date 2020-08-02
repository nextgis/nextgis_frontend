# Utils

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/utils) ![version](https://img.shields.io/npm/v/@nextgis/utils)

Common development tools

## Installation

### In Browser

Simply download and include with a script tag, `Utils` will be registered as a global variable.

assets

```html
<script src="../lib/ngw-connector.global.js"></script>
```

CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/ngw-connector"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-connector"></script>
```

```html
<script>
  Utils.Clipboard.copy('text to copy');
</script>
```

We recommend linking to a specific version number `/utils@[version]`

### In Node.js

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-connector
# or
$ yarn add @nextgis/ngw-connector
```

## Usage

```javascript
import { debounce, deepmerge, defined } from '@nextgis/utils';

const webMap = new WebMap(deepmerge(opt1, opt2));

const onMapMove = debounce(() => /** do something no more than once a second */, 1000);

webMap.emitter.on('move', onMapMove);

```

Check out the [API Documentation](../../markdown/utils.md)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/utils`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
