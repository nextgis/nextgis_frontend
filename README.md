# NextGIS Frontend

Suite of frontend JavaScript-libraries that allow you to speed up building your own web-gis apps using Nextgis software and services as a backend.

NextGIS Frontend support three main open-source GIS frameworks with common interfaces.

Read more in the [article](http://nextgis.com/blog/nextgis-frontend/).

Some universal examples:

- [Custom layers control](http://code.nextgis.com/demo-examples-custom_layer_controls)
- [Events](http://code.nextgis.com/demo-examples-events)
- [Data management in the vector layer](http://code.nextgis.com/demo-examples-geojson_data)
- [GeoJSON data](http://code.nextgis.com/demo-examples-geojson_layer)
- [Add layer from NGW Cloud](http://code.nextgis.com/demo-examples-ngw_layer)
- [Add webmap from NGW Cloud](http://code.nextgis.com/demo-examples-ngw_webmap)
- [Toggle button control](http://code.nextgis.com/demo-examples-toggle%20control)
- [Vector selection](http://code.nextgis.com/demo-examples-vector_selection)

## Packages `@nextgis/`

- [ngw-leaflet](http://code.nextgis.com/ngw-leaflet) – one file bundle for building [Leaflet](https://leafletjs.com/) map interacting with NextGIS services;
- [ngw-ol](http://code.nextgis.com/ngw-ol) – one file bundle for building [OpenLayers](https://openlayers.org/) map interacting with NextGIS;
- [ngw-mapbox](http://code.nextgis.com/ngw-mapbox) – one file bundle for building [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) map interacting with NextGIS;
- [ngw-map](http://code.nextgis.com/ngw-map) – abstract map to simplify work with NextGIS services;
- [ngw-connector](http://code.nextgis.com/ngw-connector) – module to interact with [NextGIS Web](http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html) REST API;
- [ngw-uploader](http://code.nextgis.com/ngw-uploader) – library providing tools for uploading data to [nextgis.com](http://nextgis.com/nextgis-com/) cloud;
- [webmap](http://code.nextgis.com/webmap) – universal map constructor;
- [leaflet-map-adapter](http://code.nextgis.com/leaflet-map-adapter) – webmap adapter to use [Leaflet](https://leafletjs.com/) GIS framework;
- [ol-map-adapter](http://code.nextgis.com/ol-map-adapter) – webmap adapter to use [OpenLayers](https://openlayers.org/) GIS framework;
- [mapboxgl-map-adapter](http://code.nextgis.com/mapboxgl-map-adapter) – webmap adapter to use [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) framework;
- [ngw-kit](http://code.nextgis.com/ngw-kit) – build webmap with [NextGIS Web](http://nextgis.ru/nextgis-web/) instance;
- [qms-kit](http://code.nextgis.com/qms-kit) – build webmap with [NextGIS QMS](https://qms.nextgis.com/) baselayer;
- [icons](http://code.nextgis.com/icons) – simple svg icons pack to display on the map;
- [dialog](http://code.nextgis.com/dialog) – utility to work with modal windows;

## Base usage

### Using directly in the browser

#### Include assets

Download and include with a script tag. \[Package\] will be registered as a global variable.

```html
<script src="./lib/[package].js"></script>
<script>
  var package = new Package(options);
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/[package]"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/[package]@0.11.0"></script>
```

### NPM/YARN

NPM/YARN is the recommended installation method when building large scale applications with [PACKAGE]. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/).

```bash
# latest stable
$ npm i -S @nextgis/[package]
# or with yarn
$ yarn add @nextgis/[package]
```

then import the \[package\] in the project modules

```js
import Package from '@nextgis/[package]';

const package = new Package(options);
```

## For developers

### Instructions for whole repository

```bash
# Clone git through ssh
git clone git@github.com:nextgis/nextgisweb_frontend.git
cd ./nextgisweb_frontend
# Install yarn and lerna global
npm i -g yarn lerna
# Install dependencies
yarn install
# Prepare packages
yarn run bootstrap
# Build all packages
yarn run prod
# Build demo app
yarn run demo
```

To generate json schema for build API pages run

```bash
yarn run doc
```

To copy the pages of universal examples from the demo/examples into the corresponding examples of frontend libraries run

```bash
yarn run examples
```

### Instructions for a particular package

```bash
# Go to package directory (for example webmap)
cd ./packages/webmap
# Run build command
yarn run build
# Run watch source files changes command
yarn run watch
```

### Publishing

To publish new version to git and npm run

```bash
lerna publish
```

When publishing, you will need to select a new version number. It is the same for all libraries.
Dependencies between packages are solved automatically.

To publish a new package, run the following command in the package folder

```bash
npm publish --access=public
```

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
