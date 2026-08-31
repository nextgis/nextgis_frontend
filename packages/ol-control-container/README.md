# OpenLayers Control Container

![version](https://img.shields.io/npm/v/@nextgis/ol-control-container)

OpenLayers integration for `@nextgis/control-container`.

The package exposes OpenLayers-compatible control factories and a control
container that places controls into map corners and nested panels.

## Installation

```bash
npm install @nextgis/ol-control-container
```

## Usage

```javascript
import {
  OlControlContainer,
  createButtonControl,
} from '@nextgis/ol-control-container';

const controls = new OlControlContainer();
map.addControl(controls);

const button = createButtonControl({
  html: '+',
  title: 'Action',
  onClick: () => {},
});

controls.addControl(button, 'top-right');
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ol-control-container`?
We provide custom development and support for this software.
[Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
