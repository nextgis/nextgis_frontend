# Cesium map adapter

Webmap adapter to use [Cesuim](https://openlayers.org/) GIS framework

This library is not intended for using directly in the browser.

Use OlMapAdapter with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
npm install @nextgis/cesium-map-adapter
```

```javascript
import { WebMap } from '@nextgis/webmap';
import MapAdapter from '@nextgis/cesium-map-adapter';

const webMap = new WebMap({
  mapAdapter: new MapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/cesium-map-adapter`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
