# ReactNgwMap component

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/react-ngw-map) ![version](https://img.shields.io/npm/v/@nextgis/react-ngw-map)

Plugin to integrate NGW maps into React web framework

## Installation

```bash
npm install @nextgis/react-ngw-map
```

```bash
npm install ol @nextgis/ol-map-adapter
```

```bash
npm install maplibre-gl @nextgis/maplibre-gl-map-adapter
```

```bash
npm install leaflet @nextgis/leaflet-map-adapter
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import ReactNgwMap from '@nextgis/react-ngw-map';

import MapAdapter from '@nextgis/ol-map-adapter';
import 'ol/ol.css';

/** Imports for Maplibre GL JS */
// import MapAdapter from '@nextgis/maplibre-gl-map-adapter';
// import 'maplibre-gl/dist/maplibre-gl.css';

/** Imports for Leaflet */
// import MapAdapter from '@nextgis/leaflet-map-adapter';
// import 'leaflet/dist/leaflet.css';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetinaUrl,
//   iconUrl: iconUrl,
//   shadowUrl: shadowUrl,
// });

function App() {
  return (
    <ReactNgwMap
      mapAdapter={ new MapAdapter() }
      baseUrl="https://demo.nextgis.com"
      resources={[{ resource: 6118, id: 'webmap', fit: true }]}
    />
  );
}

render(<App />, document.getElementById('app'));
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-map`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
