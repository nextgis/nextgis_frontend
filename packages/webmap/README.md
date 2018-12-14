# WebMap

Universal map constructor

This library is not intended for using directly in the browser.

Use Webmap with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/webmap
# or
$ yarn add @nextgis/webmap
```

```js
import WebMap from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
// manually added styles
import 'leaflet/dist/leaflet.css';

const webMap = new WebMap({
  mapAdapter: new LeafletMapAdapter()
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ol-map-adapter`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
