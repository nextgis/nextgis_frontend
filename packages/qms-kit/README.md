# Qms kit

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-kit) ![version](https://img.shields.io/npm/v/@nextgis/qms-kit)

Register [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services as
baselayers in [`@nextgis/webmap`](../webmap/README.md).

This is a developer package for libraries built on the common `WebMap` API.
Use `qms-leaflet`, `qms-ol`, or `qms-maplibre-gl` when working with an existing
native map.

## Installation

```bash
npm install @nextgis/qms-kit @nextgis/webmap
```

## Usage

### Use as a WebMap starter kit

```ts
import { createWebMap } from '@nextgis/webmap';
import { QmsKit } from '@nextgis/qms-kit';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import 'leaflet/dist/leaflet.css';

const webMap = await createWebMap({
  target: 'map',
  mapAdapter: new LeafletMapAdapter(),
  starterKits: [new QmsKit()],
});

await webMap.addBaseLayer('QMS', { qmsId: 448 });
```

### Register the adapter directly

```ts
import { createWebMap } from '@nextgis/webmap';
import { createQmsAdapter } from '@nextgis/qms-kit';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import 'leaflet/dist/leaflet.css';

const webMap = await createWebMap({
  target: 'map',
  mapAdapter: new LeafletMapAdapter(),
});

const QmsAdapter = createQmsAdapter({ webMap, qmsId: 448 });
await webMap.addBaseLayer(QmsAdapter);
```

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_qms-kit.html)
and the [package architecture guide](../../docs/PACKAGES.md).

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
