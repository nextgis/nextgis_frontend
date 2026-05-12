# MapLibre GL Control Container

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/maplibre-gl-control-container) ![version](https://img.shields.io/npm/v/@nextgis/maplibre-gl-control-container)

MapLibre GL JS integration for `@nextgis/control-container`.

The package exposes MapLibre-compatible control factories and a control
container that integrates with native MapLibre control corners.

## Installation

```bash
npm install @nextgis/maplibre-gl-control-container
```

## Usage

```javascript
import {
  MaplibreGLControlContainer,
  createButtonControl,
} from '@nextgis/maplibre-gl-control-container';

const controls = new MaplibreGLControlContainer(map);
const button = createButtonControl({
  html: '+',
  title: 'Action',
  onClick: () => {},
});

controls.addControl(button, 'top-right');
```

## Commercial support

Need to fix a bug or add a feature to
`@nextgis/maplibre-gl-control-container`? We provide custom development and
support for this software. [Contact us](http://nextgis.com/contact/) to
discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
