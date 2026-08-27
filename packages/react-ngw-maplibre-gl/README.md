# ReactNgwMaplibreGL

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/react-ngw-maplibre-gl) ![version](https://img.shields.io/npm/v/@nextgis/react-ngw-maplibre-gl)

Ready-to-use React component for a [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)-based
NextGIS Web map. It configures the MapLibre adapter for the common component
from `@nextgis/react-ngw-map`.

## Installation

```bash
npm install maplibre-gl @nextgis/react-ngw-maplibre-gl
```

## Usage

```tsx
import { createRoot } from 'react-dom/client';
import ReactNgwMap from '@nextgis/react-ngw-maplibre-gl';

function App() {
  return (
    <ReactNgwMap
      baseUrl="https://demo.nextgis.com"
      resources={[{ resource: 6118, id: 'webmap', fit: true }]}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

createRoot(document.getElementById('app')!).render(<App />);
```

The component accepts the common `ReactNgwMap` props, including
`whenCreated`, `placeholder`, and `children`. MapLibre GL JS worker setup also
applies; see the [ngw-maplibre-gl instructions](../ngw-maplibre-gl/README.md#maplibre-gl-js-6-worker).

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_react-ngw-maplibre-gl.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-maplibre-gl`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
