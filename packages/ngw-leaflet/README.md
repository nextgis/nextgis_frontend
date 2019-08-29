# Ngw Leaflet

One file bundle for building [Laeflet](https://leafletjs.com/) map interacting with NextGIS services

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. NgwLeaflet will be registered as a global variable.

```html
<script src="../lib/ngw-leaflet.js"></script>
<div id='map'></div>
<script>
  var ngwMap = new NgwLeaflet({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    qmsId: 487,
    webmapId: 3985
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-leaflet"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-leaflet@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwLeaflet. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-leaflet
# or
$ yarn add @nextgis/ngw-leaflet
```

```js
import NgwLeaflet from '@nextgis/ngw-leaflet';

const ngwLeaflet = new NgwLeaflet({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 487,
  webmapId: 3985
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-leaflet`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
