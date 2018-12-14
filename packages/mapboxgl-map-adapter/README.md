# Mapbox GL JS map adapter

Webmap adapter to use [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) framework.

This library is not intended for using directly in the browser.

Use MapboxglMapAdapter with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/mapboxgl-map-adapter
# or
$ yarn add @nextgis/mapboxgl-map-adapter
```

```js
import WebMap from '@nextgis/webmap';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';
// manually added styles

const webMap = new WebMap({
  mapAdapter: new MapboxglMapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to @nextgis/mapboxgl-map-adapter? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
