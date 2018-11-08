# ngw-leaflet

Library providing tools to show NGW cloud through leaflet.js

## Usage

### Using directly in the browser

#### Direct <script> Include

Simply download and include with a script tag. NgwMapbox will be registered as a global variable.

```html
<script src="./lib/ngw-leaflet.js"></script>
<div id='map'></div>
<script>
  var ngwMap = new NgwMapbox({
    baseUrl: 'https://demo.nextgis.com',
    target: map,
    qmsId: 487,
    webmapId: 3985
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-mapbox@latest"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-mapbox@0.4.2"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwMapbox. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-mapbox
```

```js
import NgwMapbox from 'ngw-mapbox';

const ngwMapbox = new NgwMapbox({
  baseUrl: 'https://demo.nextgis.com',
  target: map,
  qmsId: 487,
  webmapId: 3985
});

```
