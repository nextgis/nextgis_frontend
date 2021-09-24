# NgwMapbox

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-mapbox) ![version](https://img.shields.io/npm/v/@nextgis/ngw-mapbox)

Single-file bundle for rapid deployment of [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js) based web-gis applications with NextGIS services

Styles images and other assets are already in bundle, you don't need to include anything except one JS file!

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwMapbox` and `NgwMap` will be registered as a global variable.

```html
<script src="../lib/ngw-mapbox.global.js"></script>

<div id='map'></div>
<script>
  // var ngwMap = new NgwMap({
  var ngwMap = new NgwMapbox({
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
<script src="https://unpkg.com/@nextgis/ngw-mapbox"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-mapbox"></script>
```

We recommend linking to a specific version number `/ngw-mapbox@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/ngw-mapbox
# or
$ yarn add @nextgis/ngw-mapbox
```

## Usage

```javascript
import NgwMap from '@nextgis/ngw-mapbox';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985
});
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/ngw_map.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-mapbox`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
