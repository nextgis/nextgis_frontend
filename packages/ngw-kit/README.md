# NgwKit

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-kit) ![version](https://img.shields.io/npm/v/@nextgis/ngw-kit)

Build [WebMap](../webmap/README.md) with [NextGIS Web](http://nextgis.com/nextgis-web/) instance.

This library contains a WebMap plugin and utilities that allow you to interact with NextGIS Web.

Make sure CORS is registered in the [NextGIS Web settings](https://docs.nextgis.com/docs_ngcom/source/CORS.html) to be able to send requests.

## Install

```bash
npm install @nextgis/ngw-kit
```

## Usage example

As WebMap starter kit

```javascript
import { NgwKit } from '@nextgis/ngw-kit';
import { createWebMap } from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

createWebMap({
  mapAdapter: new LeafletMapAdapter(),
  starterKits: [
    new NgwKit({
      baseUrl: 'YOU NEXTGIS WEB URL',
      resource: 'WEBMAP RESOURCE ID',
    }),
  ],
});
```

Get NGW vector layer items

```javascript
import { getNgwLayerItem, getNgwLayerItems } from '@nextgis/ngw-kit';
import NgwConnector from '@nextgis/ngw-connector';

const connector = new NgwConnector({ baseUrl: 'YOU NEXTGIS WEB URL'});

getNgwLayerItem({
  resourceId: 2011,
  featureId: 1,
  connector: connector
}).then((item) => { ... });

getNgwLayerItems({
  resourceId: 2011,
  offset: 10,
  limit: 300,
  fields: ['name', 'year', 'Ni', 'Cu', 'Pt', 'Pd', 'Au']
  orderBy: ['year']
}).then((items) => { ... });
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/ngw_kit.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-kit`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
