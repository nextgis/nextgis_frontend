# Ngw Ol

One file bundle for building [OpenLayers](https://openlayers.org/) map interacting with NextGIS

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. NgwOl will be registered as a global variable.

```html
<script src="../lib/ngw-ol.js"></script>
<div id='map'></div>
<script>
  var ngwMap = new NgwOl({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    qmsId: 487,
    webmapId: 3985
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-ol"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-ol@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwOl. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-ol
```

```js
import NgwOl from '@nextgis/ngw-ol';

const ngwOl = new NgwOl({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 487,
  webmapId: 3985
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-ol`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
