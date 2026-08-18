# QMS OpenLayers

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-ol) ![version](https://img.shields.io/npm/v/@nextgis/qms-ol)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to an OpenLayers map.

## Installation

```bash
npm install ol @nextgis/qms-ol
```

## Usage

Create an OpenLayers map and add a QMS service by its numeric ID:

```ts
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

import { addQmsLayer } from '@nextgis/qms-ol';

const map = new Map({
  target: 'map',
  view: new View({ center: fromLonLat([0, 20]), zoom: 2 }),
});

const layer = await addQmsLayer(map, 448);
```

Set `fit` to move the map to the QMS service extent after adding the layer:

```ts
const layer = await addQmsLayer(map, 4646, {
  fit: { padding: [24, 24, 24, 24], maxZoom: 14 },
});
```

You can also fit the map by a QMS service ID:

```ts
import { fitQmsService } from '@nextgis/qms-ol';

await fitQmsService(map, 4646, { maxZoom: 14 });
```

See the [QMS services](https://code.nextgis.com/qms-ol-examples-qms-services) and [fit to service extent](https://code.nextgis.com/qms-ol-examples-fit-service) examples.

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
