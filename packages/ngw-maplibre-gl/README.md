# NgwMaplibreGL

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-maplibre-gl) ![version](https://img.shields.io/npm/v/@nextgis/ngw-maplibre-gl)

Single-file bundle for rapid deployment of [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) based web-gis applications with NextGIS services

Styles images and other assets are already in bundle, you don't need to include anything except one JS file!

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwMaplibreGL` and `NgwMap` will be registered as a global variable.

```html
<script src="../lib/ngw-maplibre-gl.global.prod.js"></script>

<div id='map'></div>
<script>
  // const ngwMap = new NgwMaplibreGL({
  const ngwMap = new NgwMap({
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
<script src="https://unpkg.com/@nextgis/ngw-maplibre-gl"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-maplibre-gl"></script>
```

We recommend linking to a specific version number `/ngw-maplibre-gl@[version]`

### In Node.js

```bash
npm install maplibre-gl @nextgis/ngw-maplibre-gl
```

## Usage

```javascript
import NgwMap from '@nextgis/ngw-maplibre-gl';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985
});
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/ngw_maplibre_gl.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-maplibre-gl`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
