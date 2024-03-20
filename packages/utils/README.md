# Utils

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/utils) ![version](https://img.shields.io/npm/v/@nextgis/utils)

Common development tools

## Installation

### In Browser

Simply download and include with a script tag, `Utils` will be registered as a global variable.

#### Assets

```html
<script src="./lib/utils.global.js"></script>

<script>
  Utils.Clipboard.copy('text to copy');
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/utils"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/utils"></script>
```

#### ESM

```html
<script type="module">
    import { Clipboard } from './lib/utils.esm-browser.prod.js';
    // import { Clipboard } from 'https://unpkg.com/@nextgis/utils/lib/utils.esm-browser.prod.js';

    document.getElementById('copy-btn').addEventListener('click', () => {
      const text = document.getElementById('copy-input').value;
      Clipboard.copy(text);
    });
  </script>
```

We recommend linking to a specific version number `/utils@[version]`

### In Node.js

```bash
# latest stable
npm install @nextgis/ngw-connector
```

## Usage

```javascript
import { debounce, deepmerge, defined } from '@nextgis/utils';

const webMap = new WebMap(deepmerge(opt1, opt2));

const onMapMove = debounce(() => /** do something no more than once a second */, 1000);

webMap.emitter.on('move', onMapMove);

```

Check out the [API Documentation](https://code-api.nextgis.com/modules/progress.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/utils`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
