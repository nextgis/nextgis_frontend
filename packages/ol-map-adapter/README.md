# OpenLayers map adapter

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ol-map-adapter) ![version](https://img.shields.io/npm/v/@nextgis/ol-map-adapter)

Webmap adapter to use [OpenLayers](https://openlayers.org/) GIS framework

This library is not intended for using directly in the browser.

Use OlMapAdapter with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev ol @nextgis/ol-map-adapter
# or
$ yarn add ol @nextgis/ol-map-adapter
```

```javascript
import { WebMap } from '@nextgis/webmap';
import OlMapAdapter from '@nextgis/ol-map-adapter';
// manually added styles
import 'ol/ol.css';
import  '@nextgis/ol-map-adapter/lib/ol-map-adapter.css';

const webMap = new WebMap({
  mapAdapter: new OlMapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ol-map-adapter`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
