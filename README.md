# NextGIS Frontend

This repository under construction

## Packages `@nextgis/`

- [webmap](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/webmap) – universal map constructor;
- [leaflet-map-adapter](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/leaflet-map-adapter) – webmap adapter to use [Laeflet](https://leafletjs.com/) GIS framework;
- [ol-map-adapter](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ol-map-adapter) – webmap adapter to use [OpenLayers](https://openlayers.org/) GIS framework;
- [mapboxgl-map-adapter](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/mapboxgl-map-adapter) – webmap adapter to use [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) framework;
- [qms-kit](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/qms-kit) – build webmap with [Nextgis QMS](https://qms.nextgis.com/) baselayer;
- [ngw-connector](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-connector) – module for interaction with [NextGIS Web](http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html) REST API;
- [ngw-kit](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-kit) – build webmap with [NextGIS Web](http://nextgis.ru/nextgis-web/) instance;
- [ngw-uploader](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-uploader) – library providing tools for uploading data to the [NextGIS Web](http://nextgis.ru/nextgis-web/) cloud;
- [ngw-map](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-map) – abstract map to simplify work with NextGIS services;
- [ngw-leaflet](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-leaflet) – one file bundle for building [Laeflet](https://leafletjs.com/) map interacting with NextGIS services;
- [ngw-ol](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-ol) – one file bundle for building [OpenLayers](https://openlayers.org/) map interacting with NextGIS;
- [ngw-mapbox](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/ngw-mapbox) – one file bundle for building [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) map interacting with NextGIS;
- [dialog](https://github.com/nextgis/nextgisweb_frontend/tree/master/packages/dialog) – utility for working with modal windows;

## Base usage

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. \[Package\] will be registered as a global variable.

```html
<script src="./lib/[package].js"></script>
<script>
  var package = new Package(options);
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/[package]@latest"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/[package]@0.4.0"></script>
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

### Instruction for whole repository

```bash
# Clone git through ssh
git clone git@github.com:nextgis/nextgisweb_frontend.git
cd ./nextgisweb_frontend
# Install yarn and lerna global
npm i -g yarn lerna
# Install dependencies
yarn install
# Prepare packages
lerna bootstrap
# Build all packages
lerna run build
```

### Instruction for each packages

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

### Troubleshoot

Sometimes there are problems of establishing dependencies between libraries.
For example, between the ngw-kit and the ngw-connector.
In this case, you need to execute commands from root directory

```bash
rm -rf ./node_modules
# or
del ./node_modules # for Windows
lerna clean
lerna bootstrap
```

---

During the publication, an error may occur if the git is not connected via ssh, but via http[s]

---

VSCode

[Bug](https://github.com/Microsoft/vscode/issues/25312) Wen not finding symbolyc linked modules try to

1. `CTRL` + `SHIFT` + `P` & equivalent for MacOS (brings up the command palette)
2. Search something like "typescript"
3. Select TypeScript: Restart TS server

---

### Helpful information

Some [lerna+yarn instruction](https://medium.com/trabe/monorepo-setup-with-lerna-and-yarn-workspaces-5d747d7c0e91)

Useful VSCode plugins:

- alefragnani.numbered-bookmarks
- donjayamanne.githistory
- eamodio.gitlens
- EditorConfig.EditorConfig
- eg2.tslint
- k--kato.intellij-idea-keybindings (shortcuts like intellij)
- octref.vetur (Vue for demo project)
- prograhammer.tslint-vue (Vue)
- ritwickdey.LiveServer
- wayou.vscode-todo-highlight

## Commercial support

Need to fix a bug or add a feature to NextGIS Web? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
