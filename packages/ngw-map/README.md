# NgwMap

Abstract map for ngw

This library is not intended for using directly in the browser.

Use NgwMap with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-map
# or
$ yarn add @nextgis/ngw-map
```

```js
import NgwMap from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
// manually added styles
import 'leaflet/dist/leaflet.css';

const ngwMap = new NgwMap(new LeafletMapAdapter(), {
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 487,
  webmapId: 3985
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-map`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
