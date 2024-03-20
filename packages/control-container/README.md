# Control Container

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/control-container) ![version](https://img.shields.io/npm/v/@nextgis/cache)

This library allows placing control elements in the corners of the map container.

Libraries such as `Leaflet` and `Maplibre GL JS` are already doing this,
but `Cesium` and `Openlayers` do not have similar functionality.

```text
╭───────────────────────────────────────────╮
│ top-left                        top-right │
│                   MAP                     │
│ bottom-left                  bottom-right │
╰───────────────────────────────────────────╯
```

## Installation

```bash
# latest stable
npm install @nextgis/control-container
```

## Usage

```javascript
import ControlContainer from '@nextgis/control-container';

// initialization
const controlContainer = new ControlContainer({ target: 'map-control-id' });
// or
const controlContainer = new ControlContainer({ map: webMap });
controlContainer.addTo('.map-control-class');

// add simple HTML string
controlContainer.append('<div>HTML</div>', 'top-right');
// or HTML element
controlContainer.append(HTMLElement, 'top-right');

// add control
const control = {
    onAdd(webMap) {
        const container = document.createContainer('div');
        webMap.emitter.on('zoomend', () => {
            container.innerHTML = webMap.getZoom();
        });
        return container
    }
}
controlContainer.addControl(control, 'bottom-right');
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/control-container`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
