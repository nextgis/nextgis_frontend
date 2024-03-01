# NgwOl

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-ol) ![version](https://img.shields.io/npm/v/@nextgis/ngw-ol)

Single-file bundle for rapid deployment of [OpenLayers](https://openlayers.org/)-based web-gis applications with NextGIS services

Styles images and other assets are already in bundle, you don't need to include anything except one JS file!

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwOl` and `NgwMap` will be registered as a global variable.

```html
<script src="../lib/ngw-ol.global.js"></script>

<div id='map'></div>
<script>
  // var ngwMap = new NgwMap({
  var ngwMap = new NgwOl({
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
<script src="https://unpkg.com/@nextgis/ngw-ol"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-ol"></script>
```

We recommend linking to a specific version number `/ngw-ol@[version]`

### In Node.js

```bash
$ npm install --save-dev @nextgis/ngw-ol
# or
$ yarn add @nextgis/ngw-ol
```

## Usage

```javascript
import NgwMap from '@nextgis/ngw-ol';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985
});
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/ngw_map.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-ol`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
