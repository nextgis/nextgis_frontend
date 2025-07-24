# NextGIS Frontend

![Github lerna version](https://img.shields.io/github/lerna-json/v/nextgis/nextgis_frontend)

[![NextGIS Code](https://raw.githubusercontent.com/nextgis/nextgis_frontend/master/demo/public/logo_96x96.png)](http://code.nextgis.com)

A suite of frontend JavaScript libraries designed to accelerate the development of web-GIS applications using NextGIS software and services as a backend. NextGIS Frontend supports three major open-source GIS frameworks with unified interfaces.

## Table of Contents

- [Quick Links](#quick-links)
- [Featured Examples](#featured-examples)
- [Packages `@nextgis/[package-name]`](#packages-nextgispackage-name)
  - [Ready-to-use maps](#ready-to-use-maps)
  - [Map development tools](#map-development-tools)
  - [NextGIS Web (NGW) Tools](#nextgis-web-ngw-tools)
  - [React integration components](#react-integration-components)
  - [Utilities](#utilities)
- [Getting Started](#getting-started)
  - [Browser Integration](#browser-integration)
    - [Include assets](#include-assets)
    - [Via CDN](#via-cdn)
  - [Node.js Integration](#nodejs-integration)
- [Usage](#usage)
  - [Map Creation](#map-creation)
  - [Adding Layers from NextGIS Web](#adding-layers-from-nextgis-web)
- [TypeScript Support](#typescript-support)
  - [Installing NGW Types](#installing-ngw-types)
- [Developer Guide](#developer-guide)
  - [Repository Setup](#repository-setup)
  - [Package-Specific Instructions](#package-specific-instructions)
  - [Publishing](#publishing)
  - [Testing](#testing)
- [Commercial Support](#commercial-support)

## Quick Links

- [Live Examples & Documentation](https://code.nextgis.com)
- [API Documentation](https://code-api.nextgis.com)
- [GitHub Repository](https://github.com/nextgis/nextgis_frontend)
- [Vue2 GitHub Repository](https://github.com/nextgis/nextgis_frontend_vue2)
- [Related Article](https://nextgis.com/blog/nextgis-frontend)
- [Tutorial Repository](https://github.com/nextgis/ngf-tutorial)
- [NextGIS Official Website](https://nextgis.com)
- [NextGIS Web](https://nextgis.com/nextgis-web)
- [Cloud Pricing Plans](https://nextgis.com/pricing-base)
- [On-Premise Pricing](https://nextgis.com/pricing)
- [Telegram Chat](https://t.me/nextgis_chat)

## Featured Examples

- [Add layer from NextGIS Web](http://code.nextgis.com/demo-examples-ngw-layer)
- [Add webmap from NextGIS Web](http://code.nextgis.com/demo-examples-ngw-webmap)
- [Zoom to NextGIS Web layer feature, partial data load](https://code.nextgis.com/demo-examples-ngw-zoom-to-feature)
- [Highlight features from NextGIS Web webmap](https://code.nextgis.com/demo-examples-webmap-identification)
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

Single-file bundles for rapid deployment of web-gis applications with NextGIS services. These packages bundle a mapping library with NextGIS integration, allowing you to quickly create a web map with minimal setup:

- [ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-leaflet) – for [Leaflet](https://leafletjs.com/);
- [ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-ol) – for [OpenLayers](https://openlayers.org/);
- [ngw-maplibre-gl](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-maplibre-gl) – for [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/);

### Map development tools

Bricks for build custom Web GIS frontend:

- [webmap](https://github.com/nextgis/nextgis_frontend/tree/master/packages/webmap) – universal map constructor;
- [leaflet-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/leaflet-map-adapter) – webmap adapter to use [Leaflet](https://leafletjs.com/) GIS framework;
- [maplibre-gl-map-adapter](https://github.com/nextgis/nextgis_frontend/tree/master/packages/maplibre-gl-map-adapter) – webmap adapter to use [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) framework;
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

### NextGIS Web (NGW) Tools

Map-free libraries to interaction with NextGIS Web. These packages allow you to work with NextGIS Web backend capabilities without needing a map component:

- [ngw-connector](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-connector) – module to interact with [NextGIS Web](http://docs.nextgis.com/docs_ngweb_dev/doc/developer/toc.html) REST API;
- [ngw-kit](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-kit) – build webmap with [NextGIS Web](http://nextgis.com/nextgis-web/) instance. Lots of useful utilities for interacting with the NextGIS Web API;
- [ngw-orm](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-orm) – NextGIS Web Object-Relational Mapping;
- [ngw-uploader](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-uploader) – library providing tools for uploading data to [nextgis.com](http://nextgis.com/nextgis-com/) cloud;
- [ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/ngw-map) – abstract map to simplify work with NextGIS services;

### React integration components

These libraries provide React components to easily embed NextGIS Web maps into React applications. Each package targets a specific mapping library:

- [react-ngw-map](https://github.com/nextgis/nextgis_frontend/tree/master/packages/react-ngw-map) – base React component for NextGIS Web maps (works with Leaflet, OpenLayers, or MapLibre GL via adapters);
- [react-ngw-leaflet](https://github.com/nextgis/nextgis_frontend/tree/master/packages/react-ngw-leaflet) – React NGW map component for [Leaflet](https://leafletjs.com/);
- [react-ngw-ol](https://github.com/nextgis/nextgis_frontend/tree/master/packages/react-ngw-ol) – React NGW map component for [OpenLayers](https://openlayers.org/);
- [react-ngw-maplibre-gl](https://github.com/nextgis/nextgis_frontend/tree/master/packages/react-ngw-maplibre-gl) – React NGW map component for [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/).

### Utilities

General-purpose utilities that are not tied to any mapping framework. These support libraries provide common functionality useful across NextGIS Frontend projects:

- [utils](https://github.com/nextgis/nextgis_frontend/tree/master/packages/utils) – common development tools;
- [cache](https://github.com/nextgis/nextgis_frontend/tree/master/packages/cache) - caching for asynchronous functions;
- [cancelable-promise](https://github.com/nextgis/nextgis_frontend/tree/master/packages/cancelable-promise) – a promise you can stop;
- [dom](https://github.com/nextgis/nextgis_frontend/tree/master/packages/dom) – collection of libraries for working with the DOM;

## Getting Started

### Browser Integration

#### Include assets

Download and include with a `<script>` tag. The `[package]` will be registered as a global variable.

```html
<script src="./lib/[package].global.js"></script>
<script>
  const package = new Package(options);
</script>
```

You can also load the ES module build directly in a modern browser:

```html
<script type="module">
  import Package from 'https://unpkg.com/@nextgis/[package]/lib/[package].esm-browser.prod.js';
</script>
```

#### Via CDN

Choose between `unpkg` and `jsdelivr` as a CDN to include a package without downloading:

Using `unpkg`:

```html
<script src="https://unpkg.com/@nextgis/[package]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]"></script>
<script src="https://unpkg.com/@nextgis/[package]@[version]/lib/[file]"></script>
```

Using `jsdelivr`

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]"></script>
<script src="https://cdn.jsdelivr.net/npm/@nextgis/[package]@[version]/lib/[file]"></script>
```

> `[file]` represents the specific bundle file - `[package].[format].prod.js`
>
> `[format]` can be:
>
> - `global` - browser script
> - `cjs` - node module
> - `esm-browser` - browser module
> - `esm-bundler` - module for bundler systems
>
> NOTE! It is highly recommended to pin to a specific `[version]` number that you can update manually for stability

### Node.js Integration

Install the desired package via npm:

```bash
npm install @nextgis/[package]
```

Then import and use the `[package]` in your project code:

```javascript
// Import the package (default export or named exports as needed)
import Package from '@nextgis/[package]';
// import { Component, utilityFn } from '@nextgis/[package]';

// Initialize and use the package
const package = new Package(options);
```

## Usage

### Map Creation

Below is a basic example of creating a map with **NextGIS Frontend**. This example uses **NgwMap** (which handles **NextGIS Web** integration) with a Leaflet map adapter:

```javascript
import { NgwMap } from '@nextgis/ngw-map';

// Choose one of the map adapters:
import 'leaflet/dist/leaflet.css';
import MapAdapter from '@nextgis/leaflet-map-adapter';
// OR, for OpenLayers:
// import 'ol/ol.css';
// import MapAdapter from '@nextgis/ol-map-adapter';
// OR, for MapLibre GL:
// import 'maplibre-gl/dist/maplibre-gl.css';
// import MapAdapter from '@nextgis/maplibre-gl-map-adapter';

const ngwMap = new NgwMap(new MapAdapter(), {
  target: 'map', // ID of the HTML element for the map
  qmsId: 448, // Optional QMS basemap ID (from NextGIS QMS)
  baseUrl: 'https://demo.nextgis.com', // Base URL of your NextGIS Web instance
  resources: [
    2011, // add a NextGIS Web resource by numeric ID
    { resource: 222, fit: true }, // add resource 222 and zoom ("fit") to it
    { resource: 'keyname' }, // add a resource by its keyname (alias)
  ]
});

ngwMap.onLoad().then(() => {
  // This callback runs when the map and all layers have finished loading
  console.log('Map is ready!');
});
```

### Adding Layers from NextGIS Web

You can easily add layers from **NextGIS Web** to an existing map. The `NgwMap.addNgwLayer` method accepts a resource `ID` or `keyname` from your **NextGIS Web** and optional parameters:

```javascript
// Add a layer by numeric resource ID:
ngwMap.addNgwLayer({ resource: 2011 });

// Add a layer by resource keyname:
ngwMap.addNgwLayer({ resource: 'keyname' });

// Add a vector layer from a NextGIS Web *style* resource (by keyname):
ngwMap.addNgwLayer({ resource: 'vector_style_keyname', adapter: 'GEOJSON' });

// Add the first style of a vector resource (if available) as a tiled layer:
ngwMap.addNgwLayer({ resource: 'vector_layer_keyname', adapter: 'TILE' });
```

The resource field can be either an ID or a keyname (string) of the layer/webmap in NextGIS Web. For a more in-depth example, see the [Add different NextGIS Web resource](http://code.nextgis.com/demo-examples-ngw-layers) demo which shows various ways to add resources.

## TypeScript Support

If you plan to use NextGIS Frontend libraries in a TypeScript project, we recommend installing the NextGIS Web type declarations. NextGIS provides a CLI tool `@nextgis/ngw-types-loader` to download TypeScript definitions for your NextGIS Web instance and configure your project automatically

### Installing NGW Types

Run the following command to download the latest NextGIS Web TypeScript declaration file:

```bash
npx @nextgis/ngw-types-loader
```

By default, this will fetch type definitions from the public NextGIS Web demo at [demo.nextgis.com](`https://demo.nextgis.com`) and save them as a `nextgisweb.d.ts` file in your project. It will also prompt to update your `tsconfig.json` to include this definitions file

If you are using a [self-hosted NextGIS Web instance](https://nextgis.com/pricing), specify its URL to get types specific to your deployment:

```bash
npx @nextgis/ngw-types-loader https://your-custom-ngw-url.com
```

After running the tool, ensure that your `tsconfig.json` includes the downloaded file:

```json
{
  "include": [
    "./nextgisweb.d.ts"
  ]
}
```

For more details, refer to the [NGW Types Loader](https://www.npmjs.com/package/@nextgis/ngw-types-loader).

## Developer Guide

### Repository Setup

To work with the NextGIS Frontend monorepo locally, ensure you have [Yarn](https://yarnpkg.com/lang/en/docs/install/) installed. Then run:

```bash
# Clone the repository
git clone git@github.com:nextgis/nextgis_frontend.git
cd nextgis_frontend

# Install all dependencies
yarn install

# Build all packages (production builds)
yarn run prod

# Build the demo app (for local testing of examples)
yarn run demo
```

After building, you can run the local demo application to see examples of each library in action. You can also copy over the universal example pages into each package’s example directory by running:

```bash
yarn run examples
```

This will update example pages in the packages with the latest demo examples.

### Package-Specific Instructions

Each package in the monorepo can be worked on and built individually. For example, to work on the `webmap` package:

```bash
# Navigate to the package directory
cd packages/webmap

# Start a development build (with watch for changes)
yarn run dev

# (or) Build the package for production
yarn run prod

# You can also continuously watch source files for changes
yarn run watch
```

### Publishing

(For maintainers) Before publishing updates, make sure to build all packages in production mode:

```bash
npm run prod
```

To publish a new version of all packages to npm (and create a git tag), use Lerna from the root of the repository:

```bash
npm run publish
```

You will be prompted to choose the new version number, which will be applied to all packages (the monorepo uses a unified version). Lerna will handle inter-package dependencies during the version bump.

To publish a brand new package (if one is added to the monorepo) for the first time, go into that package folder and run:

```bash
npm publish --access=public
```

## Testing

This repository includes a comprehensive test suite. Tests cover all packages and can be run from the root:

```bash
npm t # run all test with coverage
npm run karma # run karma test in watch mode for development
```

## Commercial support

Need to fix a bug or add a feature to NextGIS Frontend? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
