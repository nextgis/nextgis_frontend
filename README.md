# NextGIS Frontend

[![http://code.nextgis.com](https://raw.githubusercontent.com/nextgis/nextgis_frontend/master/packages/demo/src/images/logo_96x96.png)](http://code.nextgis.com)

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

## Example projects

- [russia-history](https://github.com/nextgis/russia-history) – Russia history live web map ([LIVE](https://map.runivers.ru))
- [nextgisweb_viewer](https://github.com/nextgis/nextgisweb_viewer) – Service for viewing map resources from NextGIS WEB ([LIVE](http://viewer.nextgis.com))
- [ngw_frontend_boilerplate](https://github.com/nextgis/ngw_frontend_boilerplate)
- [wwf-oilspill](https://github.com/nextgis/wwf-oilspill) – Emergency situations with oil spills ([LIVE](http://nextgis.ru/demo/oilspill/build/))
- [oralhistory](https://github.com/nextgis/oralhistory) ([LIVE](https://nextgis.ru/demo/oralhistory/dist/))
- [clear_horizon_frontend](https://github.com/nextgis/clear_horizon_frontend) – Clear horizon frontend.
- [petro2020](https://github.com/rendrom/petro2020) ([LIVE](http://petro2020.igc.irk.ru/))

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
<script src="https://unpkg.com/@nextgis/[package]@0.19.0"></script>
```

### NPM/YARN

NPM/YARN is the recommended installation method when building large scale applications with [PACKAGE]. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/).

```bash
# latest stable
npm i -S @nextgis/[package]
# or with yarn
yarn add @nextgis/[package]
```

then import the \[package\] in the project modules

```js
import Package from "@nextgis/[package]";

const package = new Package(options);
```

## Create map

```js
import NgwMap from "@nextgis/ngw-map";

import "./leaflet-style-override.css";
import MapAdapter from "@nextgis/leaflet-map-adapter";
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

## Add layers from NGW

```js
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

### Examples

[Add different NGW resource](http://code.nextgis.com/demo-examples-ngw_layers)

## Vector layer

Adding a vector layer from the NGW is as follows

```js
ngwMap.addNgwLayer({
  resource: 2011,
  adapterOptions: {...},
});
```

adapterOptions

| name                  | default        | description                                                                                                                                                                    |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type                  | undefined      | `point`, `line` or `polygon`. Type of layer geometry. It is always better to prescribe this parameter in order to properly initialize the layer paint before loading the data. |
| paint                 | {color:'blue'} | `Object`, `Function` or `Expression` to set the appearance of the layer                                                                                                        |
| selectedPaint         | undefiend      | Like paint, but used to decorate selected elements                                                                                                                             |
| selectable            | false          | Indicates that the selection is working on this layer                                                                                                                          |
| multiselect           | false          | Select multiple items                                                                                                                                                          |
| unselectOnSecondClick | false          | So it is, unselect on second click                                                                                                                                             |
| filter                | undefined      | `PropertiesFilter` expression to filter layer items                                                                                                                            |

### Painting

Vector layer painting in nextgis frontend is common for any type of geometry.

```js
// strict
paint: { color: "red", fillOpacity: 0.5, stroke: true }
// use the properties of the layer item
paint: { color: ['get', 'color'], radius: ['get', 'radius'] }
// different paint for different filters
paint: [
  { radius: 6, stroke: true, fillOpacity: 0.5 }, // base paint
  [[['AMENITY', 'eq', 'restaurant']], { color: 'green', fillOpacity: 1 }],
  [[['AMENITY', 'eq', 'cafe']], { color: 'red' }]
],
// paint callback function
paint: (feature) => {
  return { color: feature.properties.color };
} // better use `{ color: ['get', 'color']}` expression
```

#### Examples

[Vector painting](http://code.nextgis.com/demo-examples-vector_paint)
[Expression paint](http://code.nextgis.com/demo-examples-expression_paint)
[Expression paint with match](http://code.nextgis.com/demo-examples-expression_paint_match)
[Properties paint](http://code.nextgis.com/demo-examples-properties_paint)

### Filtering

```js
```

### Selection

```js
```

## Map events

```js
```

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

Before publishing you should execute `prod` and `doc:api` scripts

```bash
lerna run prod
yarn docs:api
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

```json
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

Set configuration for Chrome Debugger

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "NgwLeaflet debug",
  "url": "http://127.0.0.1:5500",
  "webRoot": "${workspaceFolder}/http://127.0.0.1:5500/packages/demo/examples",
  "sourceMapPathOverrides": {
    "webpack://NgwLeaflet/../*": "${webRoot}/packages/*"
  }
}
```

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
