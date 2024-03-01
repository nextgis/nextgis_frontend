# WebMap

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/webmap) ![version](https://img.shields.io/npm/v/@nextgis/webmap)

Universal map constructor

Use Webmap with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/webmap
# or
$ yarn add @nextgis/webmap
```

```javascript
import { WebMap } from '@nextgis/webmap';
import MapAdapter from '@nextgis/leaflet-map-adapter';
// manually added styles
import 'leaflet/dist/leaflet.css';

const webMap = new WebMap({
  mapAdapter: new MapAdapter()
});

webMap.onLoad().then(() => {
  // on map adapter created
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/webmap`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
