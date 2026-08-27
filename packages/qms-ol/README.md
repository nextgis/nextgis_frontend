# QMS OpenLayers

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-ol) ![version](https://img.shields.io/npm/v/@nextgis/qms-ol)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to an OpenLayers map.
Use this package when the application owns the native OpenLayers map instance.

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
import '@nextgis/qms-ol/lib/qms-ol.css';

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

Add the QMS search and catalog control to the map:

```ts
import { createQmsControl } from '@nextgis/qms-ol';

map.addControl(createQmsControl({ initialLayer: 448 }));
```

| Option          | Type                          | Default | Description                                                     |
| --------------- | ----------------------------- | ------- | --------------------------------------------------------------- |
| `initialLayer`  | `number \| (() => BaseLayer)` |         | QMS service ID or a layer already added to the map.             |
| `target`        | `HTMLElement \| string`       |         | Optional OpenLayers control target.                             |
| `search`        | `boolean`                     | `true`  | Show QMS search.                                                |
| `catalog`       | `boolean`                     | `true`  | Show the catalog.                                               |
| `closeOnSelect` | `boolean`                     | `false` | Close the panel after selecting a service.                      |
| `lang`          | `string`                      | `'en'`  | Built-in language: `en`, `de`, `es`, `fr`, `it`, `pt`, or `ru`. |
| `limit`         | `number`                      | `10`    | Maximum search results for each service type.                   |
| `className`     | `string`                      |         | Additional class for custom control styles.                     |

OpenLayers placement can also be changed with `--nextgis-qms-control-top` and
`--nextgis-qms-control-left`.

## Examples

- [QMS services](https://code.nextgis.com/qms-ol-examples-qms-services)
- [Fit to service extent](https://code.nextgis.com/qms-ol-examples-fit-service)
- [QMS control](https://code.nextgis.com/qms-ol-examples-search-control)

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_qms-ol.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
