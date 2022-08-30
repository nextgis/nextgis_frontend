# Leaflet Map Adapter

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/leaflet-map-adapter) ![version](https://img.shields.io/npm/v/@nextgis/leaflet-map-adapter)

WebMap adapter to use [Leaflet](https://leafletjs.com/) GIS framework.

## Install

```bash
$ npm install --save-dev leaflet @nextgis/leaflet-map-adapter
# or
$ yarn add leaflet @nextgis/leaflet-map-adapter
```

## Usage

```javascript
import { WebMap } from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

const webMap = new WebMap({
  mapAdapter: new LeafletMapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/leaflet-map-adapter`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
