# Maplibre GL JS map adapter

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/maplibre-gl-map-adapter) ![version](https://img.shields.io/npm/v/@nextgis/maplibre-gl-map-adapter)

Webmap adapter to use [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) framework.

This library is not intended for using directly in the browser.

Use MaplibreGLMapAdapter with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev maplibre-gl @nextgis/maplibre-gl-map-adapter
# or
$ yarn add maplibre-gl @nextgis/maplibre-gl-map-adapter
```

```javascript
import { WebMap } from '@nextgis/webmap';
import MaplibreGLMapAdapter from '@nextgis/maplibre-gl-map-adapter';
// manually added styles

const webMap = new WebMap({
  mapAdapter: new MaplibreGLMapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to @nextgis/maplibre-gl-map-adapter? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
