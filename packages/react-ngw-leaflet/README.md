# ReactNgwLeaflet

![version](https://img.shields.io/npm/v/@nextgis/react-ngw-leaflet)

Ready-to-use React component for a Leaflet-based NextGIS Web map. It configures
the Leaflet adapter for the common component from `@nextgis/react-ngw-map`.

## Installation

```bash
npm install leaflet @nextgis/react-ngw-leaflet
```

## Usage

```tsx
import { createRoot } from 'react-dom/client';
import ReactNgwMap from '@nextgis/react-ngw-leaflet';

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
`whenCreated`, `placeholder`, and `children`.

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_react-ngw-leaflet.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-leaflet`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
