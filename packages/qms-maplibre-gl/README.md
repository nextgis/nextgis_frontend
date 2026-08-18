# QMS MapLibre GL

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-maplibre-gl) ![version](https://img.shields.io/npm/v/@nextgis/qms-maplibre-gl)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to a MapLibre GL JS map.

## Installation

```bash
npm install maplibre-gl @nextgis/qms-maplibre-gl
```

## Usage

Create a MapLibre GL JS map and add a QMS service after the map style is loaded:

```ts
import { Map, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { addQmsLayer } from '@nextgis/qms-maplibre-gl';

const map = new Map({
  container: 'map',
  style: { version: 8, sources: {}, layers: [] },
  center: [0, 20],
  zoom: 2,
});

map.once('load', () => {
  addQmsLayer(map, 448);
});
```

Set `fit` to move the map to the QMS service extent after adding the layer:

```ts
const layer = await addQmsLayer(map, 4646, {
  fit: { padding: 24, maxZoom: 14 },
});
```

You can also fit the map by a QMS service ID:

```ts
import { fitQmsService } from '@nextgis/qms-maplibre-gl';

await fitQmsService(map, 4646, { maxZoom: 14 });
```

See the [QMS services](https://code.nextgis.com/qms-maplibre-gl-examples-qms-services) and [fit to service extent](https://code.nextgis.com/qms-maplibre-gl-examples-fit-service) examples.

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
