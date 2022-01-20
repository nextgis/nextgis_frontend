# NgwMap

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-map) ![version](https://img.shields.io/npm/v/@nextgis/ngw-map)

Abstract Map for NGW

This library is not intended for using directly in the browser.

Use NgwMap with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-map
# or
$ yarn add @nextgis/ngw-map
```

```javascript
import { NgwMap } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';
// manually added styles
import 'leaflet/dist/leaflet.css';

const ngwMap = new NgwMap({
  mapAdapter: new MapAdapter(),
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-map`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
