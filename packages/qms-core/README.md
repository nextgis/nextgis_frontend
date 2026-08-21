# QMS Core

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-core) ![version](https://img.shields.io/npm/v/@nextgis/qms-core)

Load and prepare TMS and WMS services from [NextGIS QMS](https://qms.nextgis.com/).

```ts
import { QmsClient } from '@nextgis/qms-core';

const qms = new QmsClient();
const layer = await qms.getLayer(448);
```

To use a custom QMS server, set the global URL before creating a client:

```ts
QmsClient.url = 'http://localhost:8000';
```

Get a service extent as `[west, south, east, north]` in EPSG:4326:

```ts
import { getQmsServiceExtent } from '@nextgis/qms-core';

const extent = await getQmsServiceExtent(4646);
```

Search for services by name or description:

```ts
const services = await qms.searchServices('OpenStreetMap', { type: 'tms' });
```

The bundled catalog is generated from
[quickmapservices_contrib](https://github.com/nextgis/quickmapservices_contrib).
The catalog is generated automatically before the package build. To
update it manually, run:

```bash
yarn workspace @nextgis/qms-core catalog:update
```

`QmsControlElement` provides the shared search and catalog UI used by the map
adapters. Search and catalog can be enabled independently. Its
`nextgis-qms-control` classes and CSS custom properties can be overridden by
the host interface.

Built-in control languages are `en`, `de`, `es`, `fr`, `it`, `pt`, and `ru`.
Select one with `lang` (`en` by default):

```ts
import { QmsControlElement } from '@nextgis/qms-core';

const control = new QmsControlElement({
  lang: 'ru',
  messages: {
    title: 'Подложки',
  },
});
```

`messages` can override search panel labels.

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
