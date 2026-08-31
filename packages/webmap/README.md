# WebMap

![version](https://img.shields.io/npm/v/@nextgis/webmap)

Framework-independent map engine and adapter contract.

`WebMap` manages the map lifecycle, layers, controls, events, view state,
selection, filtering, and ordering without depending on a particular rendering
engine or backend. It is primarily intended for adapter and library authors.

Applications connected to NextGIS Web normally use one of `ngw-leaflet`,
`ngw-ol`, or `ngw-maplibre-gl`. Their map classes inherit the API documented by
this package through `NgwMap`.

## Installation

```bash
npm install @nextgis/webmap @nextgis/leaflet-map-adapter leaflet
```

## Usage

```ts
import { createWebMap } from '@nextgis/webmap';
import MapAdapter from '@nextgis/leaflet-map-adapter';
import 'leaflet/dist/leaflet.css';

const webMap = await createWebMap({
  target: 'map',
  mapAdapter: new MapAdapter(),
});
```

Use this package to implement:

- common layer operations through `WebMapLayers`;
- controls through `WebMapControls`;
- lifecycle, events, and view operations through `WebMapMain`;
- new `MapAdapter` and `LayerAdapter` implementations;
- starter kits that register controls and layer providers.

Backend-specific behavior, including NextGIS Web requests and resources, does
not belong in this package.

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_webmap.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/webmap`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
