# NgwMap

![version](https://img.shields.io/npm/v/@nextgis/ngw-map)

Framework-independent NextGIS Web map class used by `ngw-leaflet`, `ngw-ol`,
and `ngw-maplibre-gl`.

Most applications should import one of those ready-to-use packages. Use
`@nextgis/ngw-map` directly when creating another map distribution, injecting a
custom map adapter, or extending the common NextGIS Web behavior.

`NgwMap` extends [`WebMap`](../webmap/README.md), adds an `NgwConnector`, and
provides NextGIS Web resources, feature requests, identification, selection,
and extent operations. It also re-exports the public `@nextgis/webmap` API.

## Installation

```bash
npm install @nextgis/ngw-map @nextgis/leaflet-map-adapter leaflet
```

## Usage

```ts
import { NgwMap } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';
import 'leaflet/dist/leaflet.css';

const ngwMap = new NgwMap({
  mapAdapter: new MapAdapter(),
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985,
});

await ngwMap.onLoad();
```

The map adapter is required when this package is used directly. The
ready-to-use map packages create it automatically.

Important inherited API groups include:

- NextGIS Web resources: `addNgwLayer()`, `fitResource()`, and `connector`;
- features and identification: `fetchNgwLayerItems()`,
  `fetchIdentifyGeoJson()`, and `ngw:select` events;
- common WebMap layers, controls, events, filtering, and view methods.

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw-map.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-map`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
