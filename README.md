# NextGIS Frontend

[![http://code.nextgis.com](https://raw.githubusercontent.com/nextgis/nextgis_frontend/master/demo/src/images/logo_96x96.png)](http://code.nextgis.com)

Suite of frontend JavaScript-libraries that allow you to speed up building your own web-gis apps using NextGIS software and services as a backend.

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

### Ready to use maps

Single-file bundles for rapid deployment of web-gis applications with NextGIS services

- [ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-leaflet) – for [Leaflet](https://leafletjs.com/);
- [ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-ol) – for [OpenLayers](https://openlayers.org/);
- [ngw-mapbox](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-mapbox) – for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/);

### Map constructor
- [ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-map) – abstract map to simplify work with NextGIS services;
- [webmap](https://github.com/nextgis/nextgis_frontend/tree/master/packages/webmap) – universal map constructor;
- [leaflet-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/leaflet-map-adapter) – webmap adapter to use [Leaflet](https://leafletjs.com/) GIS framework;
- [mapboxgl-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/mapboxgl-map-adapter) – webmap adapter to use [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) framework;
- [ol-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ol-map-adapter) – webmap adapter to use [OpenLayers](https://openlayers.org/) GIS framework;
- [ngw-kit](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-kit) – build webmap with [NextGIS Web](http://nextgis.ru/nextgis-web/) instance;
- [qms-kit](https://github.com/nextgis/nextgis_frontend/tree/master/packages/qms-kit) – build webmap with [NextGIS QMS](https://qms.nextgis.com/) baselayer;
- [icons](https://github.com/nextgis/nextgis_frontend/tree/master/packages/icons) – simple svg icons pack to display on the map;
- [dialog](https://github.com/nextgis/nextgis_frontend/tree/master/packages/dialog) – utility to work with modal windows;
- [control-container](https://github.com/nextgis/nextgis_frontend/tree/master/packages/control-container) – placing control elements in the corners of the map container;
- [paint](https://github.com/nextgis/nextgis_frontend/tree/master/packages/paint) – working with the style of vector layers;
- [properties-filter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/properties-filter) – filtering objects by its properties using JSON-serializable expressions;
- [url-runtime-params](https://github.com/nextgis/nextgis_frontend/tree/master/packages/url-runtime-params) – writing and reading URL parameters;
- [item](https://github.com/nextgis/nextgis_frontend/tree/master/packages/item) – hierarchical layers control;

### NextGisWeb Tools
- [ngw-connector](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-connector) – module to interact with [NextGIS Web](http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html) REST API;
- [ngw-orm](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-orm) – NextGIS Web Object-Relational Mapping;
- [ngw-uploader](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-uploader) – library providing tools for uploading data to [nextgis.com](http://nextgis.com/nextgis-com/) cloud;


### Utilities
- [utils](https://github.com/nextgis/nextgis_frontend/tree/master/packages/utils) – common development tools;
- [dom](https://github.com/nextgis/nextgis_frontend/tree/master/packages/dom) – collection of libraries for working with the DOM;
- [cancelable-promise](https://github.com/nextgis/nextgis_frontend/tree/master/packages/cancelable-promise) – a promise you can stop;

### Vue
- [vue-ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-leaflet) – integrate NGW maps into vue.js with leaflet adapter;
- [vue-ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-ol) – integrate NGW maps into vue.js with openlayers adapter;
- [vue-ngw-mapbox](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-mapbox) – integrate NGW maps into vue.js with mapbox-gl js adapter;
- [vue-ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-map) – abstract plugin to integrate NGW maps into vue.js;
- [vuetify-ngw-components](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vuetify-ngw-components) – vuetify components for NGW Frontend
- [vuex-ngw](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vuex-ngw) – vuex store for NGW resources;

## Example projects

- [russia-history](https://github.com/nextgis/russia-history) – Russia history live web map ([LIVE](https://map.runivers.ru))
- [nextgisweb_viewer](https://github.com/nextgis/nextgisweb_viewer) – Service for viewing map resources from NextGIS Web ([LIVE](http://viewer.nextgis.com))
- [ngw_frontend_boilerplate](https://github.com/nextgis/ngw_frontend_boilerplate)
- [wwf-oilspill](https://github.com/nextgis/wwf-oilspill) – Emergency situations with oil spills ([LIVE](http://nextgis.ru/demo/oilspill/build/))
- [oralhistory](https://github.com/nextgis/oralhistory) ([LIVE](https://nextgis.ru/demo/oralhistory/dist/))
- [clear_horizon_frontend](https://github.com/nextgis/clear_horizon_frontend) – Clear horizon frontend.
- [petro2020](https://github.com/rendrom/petro2020) ([LIVE](http://petro2020.igc.irk.ru/))

## Base usage

### In browser

#### Include assets

Download and include with a script tag. \[Package\] will be registered as a global variable.

```html
<script src="./lib/[package].global.js"></script>
<script>
  var package = new Package(options);
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/[package]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]/lib/[file]"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]"></script>
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]@[version]/lib/[file]"></script>
```

We recommend linking to a specific version number that you can update manually:

### In Node.js

```bash
npm i -S @nextgis/[package]
```

```bash
yarn add @nextgis/[package]
```

then import the \[package\] in the project modules

```javascript
import Package from '@nextgis/[package]';
// or
import { Component, utility } from '@nextgis/[package]';

const package = new Package(options);
```

## Usage

### Create map

```javascript
import { NgwMap } from '@nextgis/ngw-map';

import './leaflet-style-override.css';
import MapAdapter from '@nextgis/leaflet-map-adapter';
// OR
// import 'ol/ol.css';
// import MapAdapter from '@nextgis/ol-map-adapter';
// OR
// import 'mapbox-gl/dist/mapbox-gl.css';
// import MapAdapter from '@nextgis/mapboxgl-map-adapter';

const ngwMap = new NgwMap(new MapAdapter(), {
  target: "map",
  qmsId: 487,
  baseUrl: "https://demo.nextgis.com",
  resources: [2011, { resource: 222, fit: true }, { resource: "keyname" }],
});
ngwMap.onLoad().then(() => {
  // do something
});
```

### Add layers from NGW

```javascript
// from resource id
ngwMap.addNgwLayer({ resource: 2011 });
// by keyname
ngwMap.addNgwLayer({ resource: "keyname" });
// add vector layer from style resource
ngwMap.addNgwLayer({ resource: "style_keyname", adapter: "GEOJSON" });
// add first style from vector resource (if available)
ngwMap.addNgwLayer({ resource: "vector_keyname", adapter: "TILE" });
```

The `resource` can be id or keyname.

#### Examples

[Add different NGW resource](http://code.nextgis.com/demo-examples-ngw_layers)

## For developers

### Instructions for whole repository

First install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

```bash
# Clone git through ssh
git clone git@github.com:nextgis/nextgis_frontend.git
cd ./nextgis_frontend
# Install dependencies
yarn install
# Prepare packages
yarn run bootstrap
# Build all packages
yarn run prod
# Build demo app
yarn run demo
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
yarn run dev
# or
yarn run prod
# Run watch source files changes command
yarn run watch
```

### Publishing

Before publishing you should execute `prod` script

```bash
lerna run prod
```

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

## Testing

The tests are launched from the root project directory. Testing is performed for all packages.

```bash
npm t # run all test with coverage
npm run karma # run karma test in watch mode for development
```

## VSCode

### Eslint for typescript configuration

Open VSCode `File > Preferences > Settings` JSON view and add this to config:

```bash
mkdir .vscode && touch .vscode/settings.json
```

```javascripton
{
  "editor.formatOnSave": false,
  "tslint.enable": false,
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Debugging with Chrome, LiveServer and Watch

Example for ngw-leaflet:

Run webpack building with watch

```bash
cd ./packages/ngw-leaflet
yarn run watch
```

Run LiveServer for some example index.html

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
