# QMS Leaflet

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-leaflet) ![version](https://img.shields.io/npm/v/@nextgis/qms-leaflet)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to a Leaflet map.

## Installation

```bash
npm install leaflet @nextgis/qms-leaflet
```

## Usage

Create a Leaflet map and add a QMS service by its ID:

```ts
import { map as createMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { addQmsLayer } from '@nextgis/qms-leaflet';

const map = createMap('map').setView([20, 0], 2);
const layer = await addQmsLayer(map, 448);
```

Set `fit` to move the map to the QMS service extent after adding the layer:

```ts
const layer = await addQmsLayer(map, 4646, {
  fit: { padding: [24, 24], maxZoom: 14 },
});
```

You can also fit the map by a QMS service ID:

```ts
import { fitQmsService } from '@nextgis/qms-leaflet';

await fitQmsService(map, 4646, { maxZoom: 14 });
```

See the [QMS services](https://code.nextgis.com/qms-leaflet-examples-qms-services) and [fit to service extent](https://code.nextgis.com/qms-leaflet-examples-fit-service) examples.

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
