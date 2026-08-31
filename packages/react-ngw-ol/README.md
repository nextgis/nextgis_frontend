# ReactNgwOl

![version](https://img.shields.io/npm/v/@nextgis/react-ngw-ol)

Ready-to-use React component for an OpenLayers-based NextGIS Web map. It
configures the OpenLayers adapter for the common component from
`@nextgis/react-ngw-map`.

## Installation

```bash
npm install ol @nextgis/react-ngw-ol
```

## Usage

```tsx
import { createRoot } from 'react-dom/client';
import ReactNgwMap from '@nextgis/react-ngw-ol';

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

See the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_react-ngw-ol.html)
and the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-ol`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
