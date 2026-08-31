# NgwLeaflet

![version](https://img.shields.io/npm/v/@nextgis/ngw-leaflet)

Ready-to-use [Leaflet](https://leafletjs.com)-based map for NextGIS Web.

This package configures the Leaflet map adapter and includes its styles and
marker images. Its default export extends `NgwMap`, so the common APIs from
[`@nextgis/ngw-map`](../ngw-map/README.md) and
[`@nextgis/webmap`](../webmap/README.md) are available on the map instance.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwLeaflet` and `NgwMap` will be registered as a global variable.

```html
<script src="../lib/ngw-leaflet.global.js"></script>

<div id='map'></div>
<script>
  // var ngwMap = new NgwMap({
  var ngwMap = new NgwLeaflet({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    qmsId: 448,
    webmapId: 3985
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/ngw-leaflet"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-leaflet"></script>
```

We recommend linking to a specific version number `/ngw-leaflet@[version]`

#### ES module

```html
<script type="module">
  import NgwMap from 'https://cdn.jsdelivr.net/npm/@nextgis/ngw-leaflet@VERSION/lib/ngw-leaflet.esm-browser.prod.js';

  const ngwMap = await NgwMap.create({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    resources: [{ resource: 2011, fit: true }],
  });
</script>
```

### In Node.js

```bash
npm install leaflet @nextgis/ngw-leaflet
```

## Usage

```javascript
import NgwMap from '@nextgis/ngw-leaflet';

const ngwMap = await NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985,
});
```

Use `new NgwMap(options)` when the instance is needed before initialization is
complete. Use `NgwMap.create(options)` when subsequent code requires a ready
map.

TypeScript users should generate declarations for the NextGIS Web deployment
used by the application:

```bash
npx @nextgis/ngw-types-loader https://your-ngw-server.com
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw-leaflet.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-leaflet`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
