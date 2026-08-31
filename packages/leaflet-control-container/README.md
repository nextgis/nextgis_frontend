# Leaflet Control Container

![version](https://img.shields.io/npm/v/@nextgis/leaflet-control-container)

Leaflet integration for `@nextgis/control-container`.

The package exposes Leaflet-compatible control factories and a control container
that integrates with native Leaflet control corners.

## Installation

```bash
npm install @nextgis/leaflet-control-container
```

## Usage

```javascript
import {
  LeafletControlContainer,
  createButtonControl,
} from '@nextgis/leaflet-control-container';

const controls = new LeafletControlContainer(map);
const button = createButtonControl({
  html: '+',
  title: 'Action',
  onClick: () => {},
});

controls.addControl(button, 'top-right');
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/leaflet-control-container`?
We provide custom development and support for this software.
[Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
