# QMS Leaflet

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-leaflet) ![version](https://img.shields.io/npm/v/@nextgis/qms-leaflet)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to a Leaflet map.
Use this package when the application owns the native Leaflet map instance.

## Installation

```bash
npm install leaflet @nextgis/qms-leaflet
```

## Usage

Create a Leaflet map and add a QMS service by its ID:

```ts
import { map as createMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@nextgis/qms-leaflet/lib/qms-leaflet.css';

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

Add the QMS search and catalog control to the map:

```ts
import { createQmsControl } from '@nextgis/qms-leaflet';

createQmsControl({ initialLayer: 448, position: 'topleft' }).addTo(map);
```

| Option          | Type                      | Default      | Description                                                     |
| --------------- | ------------------------- | ------------ | --------------------------------------------------------------- |
| `initialLayer`  | `number \| (() => Layer)` |              | QMS service ID or a layer already added to the map.             |
| `position`      | `ControlPosition`         | `'topright'` | Leaflet control position.                                       |
| `search`        | `boolean`                 | `true`       | Show QMS search.                                                |
| `catalog`       | `boolean`                 | `true`       | Show the catalog.                                               |
| `closeOnSelect` | `boolean`                 | `false`      | Close the panel after selecting a service.                      |
| `lang`          | `string`                  | `'en'`       | Built-in language: `en`, `de`, `es`, `fr`, `it`, `pt`, or `ru`. |
| `limit`         | `number`                  | `10`         | Maximum search results for each service type.                   |
| `className`     | `string`                  |              | Additional class for custom control styles.                     |

## Examples

- [QMS services](https://code.nextgis.com/qms-leaflet-examples-qms-services)
- [Fit to service extent](https://code.nextgis.com/qms-leaflet-examples-fit-service)
- [QMS control](https://code.nextgis.com/qms-leaflet-examples-search-control)

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_qms-leaflet.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
