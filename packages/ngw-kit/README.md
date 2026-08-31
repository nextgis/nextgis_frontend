# NgwKit

![version](https://img.shields.io/npm/v/@nextgis/ngw-kit)

NextGIS Web integration for [`@nextgis/webmap`](../webmap/README.md), including
resource adapters, feature requests, identification, extents, legends, and
other map-related utilities.

Applications using `ngw-leaflet`, `ngw-ol`, or `ngw-maplibre-gl` already use
this package through `NgwMap`. Import `ngw-kit` directly when a utility is not
available as an `NgwMap` convenience method or when assembling a custom map
stack.

Make sure CORS is registered in the [NextGIS Web settings](https://docs.nextgis.com/docs_ngcom/source/CORS.html) to be able to send requests.

## Installation

```bash
npm install @nextgis/ngw-kit
```

## Add a NextGIS Web map to WebMap

```ts
import { NgwKit } from '@nextgis/ngw-kit';
import { createWebMap } from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

const webMap = await createWebMap({
  target: 'map',
  mapAdapter: new LeafletMapAdapter(),
  starterKits: [
    new NgwKit({
      baseUrl: 'https://demo.nextgis.com',
      resourceId: 3985,
    }),
  ],
});
```

For end-user applications, prefer a ready-to-use `ngw-*` map package instead
of assembling this stack manually.

## Request vector features

```ts
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';
import NgwConnector from '@nextgis/ngw-connector';

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
});

const items = await fetchNgwLayerItems({
  connector,
  resourceId: 2011,
  offset: 10,
  limit: 300,
  fields: ['name', 'year'],
  orderBy: ['year'],
});
```

The package also exports helpers for resource extents, feature counts,
identification results, field conversion, attachments, legends, and NextGIS
Web layer adapter creation. See the generated API documentation for the full
exported surface.

TypeScript users should generate declarations for the NextGIS Web deployment
used by the application:

```bash
npx @nextgis/ngw-types-loader https://your-ngw-server.com
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw-kit.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-kit`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
