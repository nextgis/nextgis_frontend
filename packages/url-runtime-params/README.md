# UrlRuntimeParams

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/url-runtime-params) ![version](https://img.shields.io/npm/v/@nextgis/url-runtime-params)

Control of writing and reading URL parameters

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `UrlRuntimeParams` will be registered as a global variable.

```html
<script src="../lib/url-runtime-params.global.js"></script>

<script>
  var urlParams = new UrlRuntimeParams();
  var paramValue = urlParams.get('key');
  urlParams.set('key', 'value');
  urlParams.remove('key');
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/url-runtime-params"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/url-runtime-params"></script>
```

We recommend linking to a specific version number `/url-runtime-params@[version]`

### In Node.js

```bash
npm install @nextgis/url-runtime-params
```

## Usage

```typescript
import { UrlRuntimeParams } from '@nextgis/url-runtime-params';

interface MyParams {
  key1: string;
  key2: string;
}

const urlParams = new UrlRuntimeParams<MyParams>();

// Get the value of a URL parameter
const paramValue = urlParams.get('key1');
console.log(paramValue); // Output: value of 'key1' or true if it has no value

// Set the value of a URL parameter
urlParams.set('key1', 'newValue1');
console.log(urlParams.params()); // Output: { key1: 'newValue1' }

// Update multiple URL parameters
urlParams.update({ key1: 'updatedValue1', key2: 'newValue2' });
console.log(urlParams.params()); // Output: { key1: 'updatedValue1', key2: 'newValue2' }

// Remove a URL parameter
urlParams.remove('key1');
console.log(urlParams.params()); // Output: { key2: 'newValue2' }
```

## Differences and Advantages over URLSearchParams

`UrlRuntimeParams` offers strong type safety through TypeScript, allowing you to define the structure of your URL parameters using interfaces. It provides a unified interface for managing URL parameters and ensures that changes update the browser's history state. Additionally, it automatically handles parameters without values by setting them to `true`, simplifying the management of boolean flags and similar use cases.

## Commercial support

Need to fix a bug or add a feature to `@nextgis/url-runtime-params`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
