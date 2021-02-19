# Area

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/area) ![version](https://img.shields.io/npm/v/@nextgis/area)

Dependencies free QGIS ellipsoidal area calculation reproduced in JavaScript.

also look at the Python [implementation](https://github.com/nextgis/qgis-area-calc)

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Area` will be registered as a global variable.

```html
<script src="../lib/area.global.js"></script>

<script>
  var area = Area.calculateArea(geojson);
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/area"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/area"></script>
```

We recommend linking to a specific version number `/area@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/area
# or
$ yarn add @nextgis/area
```

## Usage

```javascript
import { calculateArea, geojsonArea } from '@nextgis/area';

const area = geojsonArea(geojson);
const area2 = calculateArea([
  [51.82, 63.8],
  [43.48, 55.62],
  [75.38, 59.13],
  [51.82, 63.8], // the first and last positions MUST contain identical values
]);
```

Check out the [API Documentation](https://github.com/nextgis/nextgis_frontend/blob/master/markdown/area.md)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/area`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
