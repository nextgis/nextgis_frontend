# NextGIS Frontend

![Github lerna version](https://img.shields.io/github/lerna-json/v/nextgis/nextgis_frontend)

[![NextGIS Code](https://raw.githubusercontent.com/nextgis/nextgis_frontend/master/demo/src/images/logo_96x96.png)](http://code.nextgis.com)

A suite of frontend JavaScript libraries designed to accelerate the development of web-GIS applications using NextGIS software and services as a backend. NextGIS Frontend supports three major open-source GIS frameworks with unified interfaces.

## Quick Links

- [Live Examples & Documentation](https://code.nextgis.com)
- [API Documentation](https://code-api.nextgis.com)
- [GitHub Repository](https://github.com/nextgis/nextgis_frontend)
- [Related Article](https://nextgis.com/blog/nextgis-frontend)
- [Tutorial Repository](https://github.com/nextgis/ngf-tutorial)
- [NextGIS Official Website](https://nextgis.com)
- [NextGIS Web](https://nextgis.com/nextgis-web)
- [Cloud Pricing Plans](https://nextgis.com/pricing-base)
- [On-Premise Pricing](https://nextgis.ru/pricing)
- [Telegram Chat](https://t.me/nextgis_chat)

## Featured Examples

- [Add layer from NextGIS Web](http://code.nextgis.com/demo-examples-ngw-layer)
- [Add webmap from NextGIS Web](http://code.nextgis.com/demo-examples-ngw-webmap)
- [Zoom to NGW layer feature, partial data load](https://code.nextgis.com/demo-examples-ngw-zoom-to-feature)
- [Highlight features from NGW webmap](https://code.nextgis.com/demo-examples-webmap-identification)
- [Expression paint](https://code.nextgis.com/demo-examples-expression-paint-match)
- [Layer properties filters](https://code.nextgis.com/demo-examples-ngw-layer-properties-filters)
- [BBOX strategy for vector layer](https://code.nextgis.com/demo-examples-ngw-bbox-strategy)
- [Custom layers control](https://code.nextgis.com/demo-examples-custom-layer-controls)
- [Events](https://code.nextgis.com/demo-examples-events)
- [Data management in the vector layer](https://code.nextgis.com/demo-examples-geojson-data)
- [GeoJSON data](https://code.nextgis.com/demo-examples-geojson-layer)
- [Toggle button control](https://code.nextgis.com/demo-examples-toggle-control)
- [Vector selection](https://code.nextgis.com/demo-examples-vector-selection)
- [Vector popup](https://code.nextgis.com/demo-examples-vector-popup)
- [Web map feature identification](https://code.nextgis.com/demo-examples-webmap-identification-multiply)
- [Web map bookmarks](https://code.nextgis.com/demo-examples-ngw-webmap-bookmarks)

## Packages `@nextgis/[package-name]`

### Ready-to-use maps

Single-file bundles for rapid deployment of web-gis applications with NextGIS services

- [ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-leaflet) – for [Leaflet](https://leafletjs.com/);
- [ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-ol) – for [OpenLayers](https://openlayers.org/);
- [ngw-mapbox](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-mapbox) – for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/);

### Map development tools

Bricks for build custom Web GIS frontend

- [webmap](https://github.com/nextgis/nextgis_frontend/tree/master/packages/webmap) – universal map constructor;
- [leaflet-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/leaflet-map-adapter) – webmap adapter to use [Leaflet](https://leafletjs.com/) GIS framework;
- [mapboxgl-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/mapboxgl-map-adapter) – webmap adapter to use [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) framework;
- [ol-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ol-map-adapter) – webmap adapter to use [OpenLayers](https://openlayers.org/) GIS framework;
- [qms-kit](https://github.com/nextgis/nextgis_frontend/tree/master/packages/qms-kit) – build webmap with [NextGIS QMS](https://qms.nextgis.com/) baselayer;
- [icons](https://github.com/nextgis/nextgis_frontend/tree/master/packages/icons) – simple svg icons pack to display on the map;
- [dialog](https://github.com/nextgis/nextgis_frontend/tree/master/packages/dialog) – utility to work with modal windows;
- [control-container](https://github.com/nextgis/nextgis_frontend/tree/master/packages/control-container) – placing control elements in the corners of the map container;
- [paint](https://github.com/nextgis/nextgis_frontend/tree/master/packages/paint) – working with the style of vector layers;
- [properties-filter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/properties-filter) – filtering objects by its properties using JSON-serializable expressions;
- [url-runtime-params](https://github.com/nextgis/nextgis_frontend/tree/master/packages/url-runtime-params) – writing and reading URL parameters;
- [item](https://github.com/nextgis/nextgis_frontend/tree/master/packages/item) – hierarchical layers control;
- [geocoder](https://github.com/nextgis/nextgis_frontend/tree/master/packages/geocoder) - modern geocoder on async generators. May use different data providers.

### NextGIS Web tools

Map-free libraries to interaction with NextGIS Web

- [ngw-connector](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-connector) – module to interact with [NextGIS Web](http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html) REST API;
- [ngw-kit](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-kit) – build webmap with [NextGIS Web](http://nextgis.ru/nextgis-web/) instance. Lots of useful utilities for interacting with the NGW API;
- [ngw-orm](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-orm) – NextGIS Web Object-Relational Mapping;
- [ngw-uploader](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-uploader) – library providing tools for uploading data to [nextgis.com](http://nextgis.com/nextgis-com/) cloud;
- [ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-map) – abstract map to simplify work with NextGIS services;

### Utilities

Map-free tools for common purpose

- [utils](https://github.com/nextgis/nextgis_frontend/tree/master/packages/utils) – common development tools;
- [cache](https://github.com/nextgis/nextgis_frontend/tree/master/packages/cache) - caching for asynchronous functions;
- [cancelable-promise](https://github.com/nextgis/nextgis_frontend/tree/master/packages/cancelable-promise) – a promise you can stop;
- [dom](https://github.com/nextgis/nextgis_frontend/tree/master/packages/dom) – collection of libraries for working with the DOM;

### Vue

- [vue-ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-leaflet) – integrate NGW maps into vue.js with leaflet adapter;
- [vue-ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-ol) – integrate NGW maps into vue.js with openlayers adapter;
- [vue-ngw-mapbox](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-mapbox) – integrate NGW maps into vue.js with mapbox-gl js adapter;
- [vue-ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vue-ngw-map) – abstract plugin to integrate NGW maps into vue.js;
- [vuetify-ngw-components](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vuetify-ngw-components) – vuetify components for NGW Frontend
- [vuex-ngw](https://github.com/nextgis/nextgis_frontend/tree/master/packages/vuex-ngw) – vuex store for NGW resources;

## Real-World Projects

Explore how NextGIS frontend libraries are utilized in actual projects:

- [nglink](https://github.com/nextgis/nglink) ([LIVE](https://show.nextgis.com)) – Server side - express.js with ngw-uploader; client - webpack, typescript, ngw-map.
- [russia-history](https://github.com/nextgis/russia-history) – Russia history live web map ([LIVE](https://map.runivers.ru)). Mapbox-gl-js, NGW MTV api, layer load event listener. Webpacj and typescript.
- [clear_horizon_frontend](https://github.com/nextgis/clear_horizon_frontend) – Clear horizon frontend. NGW auth system, leaflet typescript based webpack project.
- [webpack-template](https://github.com/rendrom/nextgis-frontend-webpack-template) – Webpack based JavaScript template project.
- [walrus-ais](https://github.com/nextgis/walrus-ais) – NgwMapbox map with React.
- [wwf-oilspill](https://github.com/nextgis/wwf-oilspill) – Emergency situations with oil spills ([LIVE](http://nextgis.ru/demo/oilspill/build/)), minimal dependency typescript project with Leaflet.
- [oralhistory](https://github.com/nextgis/oralhistory) ([LIVE](https://pastandnow.ru/)) – Typescript, Vuetify, Mapbox-gl-js and properties filter usage example.
- [petro2020](https://github.com/rendrom/petro2020) ([LIVE](http://petro2020.igc.irk.ru/)). Native JavaScript for leaflet and Mapbox-gl-gs in one project.
- [nextgisweb_viewer](https://github.com/nextgis/nextgisweb_viewer) – Service for viewing map resources from NextGIS Web ([LIVE](http://viewer.nextgis.com)). Vuetify, typescript (outdated).
- [ngw_frontend_boilerplate](https://github.com/nextgis/ngw_frontend_boilerplate). Parcel build (outdated).

## Installation

### Browser Integration

#### Include assets

Download and include with a script tag. \[Package\] will be registered as a global variable.

```html
<script src="./lib/[package].global.js"></script>
<script>
  var package = new Package(options);
</script>
```

```html
<script type="module">
  import Package from 'https://unpkg.com/@nextgis/[package]/lib/[package].esm-browser.prod.js';
</script>
```

#### Via CDN

Choose between `unpkg`:

```html
<script src="https://unpkg.com/@nextgis/[package]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]/lib/[file]"></script>
```

and `jsdelivr`

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]"></script>
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]@[version]/lib/[file]"></script>
```

`[file]` - `[package].[format].prod.js`

`[format]`:

- `global` - browser script
- `cjs` - node module
- `esm-browser` - browser module
- `esm-bundler` - module for bundler systems

We recommend linking to a specific `[version]` number that you can update manually

### Node.js Integration

```bash
npm i -S @nextgis/[package]
```

```bash
yarn add @nextgis/[package]
```

then import the [package] in the project modules

```javascript
import Package from '@nextgis/[package]';
// or
import { Component, utility } from '@nextgis/[package]';

const package = new Package(options);
```

## Usage

### Map Creation

```javascript
import { NgwMap } from '@nextgis/ngw-map';

import './leaflet-style-override.css';
import MapAdapter from '@nextgis/leaflet-map-adapter';
// OR
// import 'ol/ol.css';
// import MapAdapter from '@nextgis/ol-map-adapter';
// OR
// import 'maplibre-gl/dist/maplibre-gl.css';
// import MapAdapter from '@nextgis/mapboxgl-map-adapter';

const ngwMap = new NgwMap(new MapAdapter(), {
  target: "map",
  qmsId: 448,
  baseUrl: "https://demo.nextgis.com",
  resources: [2011, { resource: 222, fit: true }, { resource: "keyname" }],
});
ngwMap.onLoad().then(() => {
  // do something
});
```

### Adding Layers from NGW

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

Examples

[Add different NGW resource](http://code.nextgis.com/demo-examples-ngw-layers)

## Developer Guide

### Repository Setup

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

### Package-Specific Instructions

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

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
