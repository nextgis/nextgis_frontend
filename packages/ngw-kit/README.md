# Ngw kit

build webmap with [NextGIS Web](http://nextgis.ru/nextgis-web/) instance.

This library is not intended for using directly in the browser.

Use NgwKit with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-kit
# or
$ yarn add @nextgis/ngw-kit
```

```js
import WebMap from '@nextgis/webmap';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import NgwKit from '@nextgis/ngw-kit';

// manually added styles
import 'leaflet/dist/leaflet.css';

const webMap = new WebMap({
  mapAdapter: new LeafletMapAdapter(),
  starterKits: [new NgwKit({
    baseUrl: 'YOU NEXTGIS CLOUD INSTANCE URL',
    resourceId: 'WEBMAP RESOURCE ID'
  })]
});

webMap.create(options).then(() => {
  // on webmap create
})
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-kit`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)

