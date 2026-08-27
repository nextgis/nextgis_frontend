# React NGW Map

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/react-ngw-map) ![version](https://img.shields.io/npm/v/@nextgis/react-ngw-map)

React integration for [`@nextgis/ngw-map`](../ngw-map/README.md). It provides
the common map component, context, hooks, layer components, and controls used by
the engine-specific React packages.

Most applications should use `react-ngw-leaflet`, `react-ngw-ol`, or
`react-ngw-maplibre-gl`. Use this package directly when supplying a map adapter
or building reusable React components around the common `NgwMap` API.

## Installation

```bash
npm install @nextgis/react-ngw-map
```

Install one map engine and its adapter as well. This example uses OpenLayers:

```bash
npm install ol @nextgis/ol-map-adapter
```

## Usage

```tsx
import { createRoot } from 'react-dom/client';
import { ReactNgwMap } from '@nextgis/react-ngw-map';

import MapAdapter from '@nextgis/ol-map-adapter';
import 'ol/ol.css';

function App() {
  return (
    <ReactNgwMap
      mapAdapter={new MapAdapter()}
      baseUrl="https://demo.nextgis.com"
      resources={[{ resource: 6118, id: 'webmap', fit: true }]}
      style={{ width: '100%', height: '100%' }}
      whenCreated={(ngwMap) => {
        // The map is initialized and exposes the common NgwMap/WebMap API.
      }}
    />
  );
}

createRoot(document.getElementById('app')!).render(<App />);
```

Components rendered as children can access the map through
`useNgwMapContext()`. The package also exports `ReactNgwLayer`, `MapControl`,
`ButtonControl`, and `ToggleControl`.

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_react-ngw-map.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-map`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
