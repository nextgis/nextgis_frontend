# Geocoder

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/geocoder) ![version](https://img.shields.io/npm/v/@nextgis/geocoder)

Modern geocoder on async generators. May use different data providers.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Geocoder` will be registered as a global variable.

```html
<script src="../lib/geocoder.global.js"></script>

<script>
  var geocoder = Geocoder.create({
    ...options
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/geocoder"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/geocoder"></script>
```

We recommend linking to a specific version number `/geocoder@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/geocoder
# or
$ yarn add @nextgis/geocoder
```

## Usage

```javascript
import { Geocoder } from '@nextgis/geocoder';

const ngwConnector = new Geocoder({
  ...options
});
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/geocoder.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/geocoder`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
