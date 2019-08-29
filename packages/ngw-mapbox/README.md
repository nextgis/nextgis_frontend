# Ngw Mapbox

One file bundle for building [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) map interacting with NextGIS;

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. NgwMapbox will be registered as a global variable.

```html
<script src="../lib/ngw-mapbox.js"></script>
<div id='map'></div>
<script>
  var ngwMap = new NgwMapbox({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    qmsId: 487,
    webmapId: 3985
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-mapbox"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-mapbox@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwMapbox. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-mapbox
```

```js
import NgwMapbox from '@nextgis/ngw-mapbox';

const ngwMapbox = new NgwMapbox({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 487,
  webmapId: 3985
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-mapbox`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
