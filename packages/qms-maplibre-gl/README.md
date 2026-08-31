# QMS MapLibre GL

![version](https://img.shields.io/npm/v/@nextgis/qms-maplibre-gl)

Add [NextGIS QMS](https://qms.nextgis.com/) TMS and WMS services directly to a MapLibre GL JS map.
Use this package when the application owns the native MapLibre GL JS map
instance.

## Installation

```bash
npm install maplibre-gl @nextgis/qms-maplibre-gl
```

## Usage

Create a MapLibre GL JS map and add a QMS service after the map style is loaded:

```ts
import { Map, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@nextgis/qms-maplibre-gl/lib/qms-maplibre-gl.css';

import { addQmsLayer } from '@nextgis/qms-maplibre-gl';

const map = new Map({
  container: 'map',
  style: { version: 8, sources: {}, layers: [] },
  center: [0, 20],
  zoom: 2,
});
map.addControl(new NavigationControl(), 'top-right');

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

Add the QMS search and catalog control to the map:

```ts
import { createQmsControl } from '@nextgis/qms-maplibre-gl';

map.addControl(createQmsControl({ initialLayer: 448 }), 'top-left');
```

| Option          | Type                                 | Default | Description                                                     |
| --------------- | ------------------------------------ | ------- | --------------------------------------------------------------- |
| `initialLayer`  | `number \| (() => QmsMaplibreLayer)` |         | QMS service ID or a layer already added to the map.             |
| `search`        | `boolean`                            | `true`  | Show QMS search.                                                |
| `catalog`       | `boolean`                            | `true`  | Show the catalog.                                               |
| `closeOnSelect` | `boolean`                            | `false` | Close the panel after selecting a service.                      |
| `lang`          | `string`                             | `'en'`  | Built-in language: `en`, `de`, `es`, `fr`, `it`, `pt`, or `ru`. |
| `limit`         | `number`                             | `10`    | Maximum search results for each service type.                   |
| `className`     | `string`                             |         | Additional class for custom control styles.                     |

## Examples

- [QMS services](https://code.nextgis.com/qms-maplibre-gl-examples-qms-services)
- [Fit to service extent](https://code.nextgis.com/qms-maplibre-gl-examples-fit-service)
- [QMS control](https://code.nextgis.com/qms-maplibre-gl-examples-search-control)

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_qms-maplibre-gl.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
