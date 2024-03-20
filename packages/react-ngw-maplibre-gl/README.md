# ReactNgwMaplibreGL

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/react-ngw-maplibre-gl) ![version](https://img.shields.io/npm/v/@nextgis/react-ngw-maplibre-gl)

Plugin to integrate NextGIS Web maps into React with [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) adapter

## Installation

```bash
npm install maplibre-gl @nextgis/react-ngw-maplibre-gl
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import ReactNgwMap from '@nextgis/react-ngw-maplibre-gl';

function App() {
  return (
    <ReactNgwMap
      baseUrl="https://demo.nextgis.com"
      resources={[{ resource: 6118, id: 'webmap', fit: true }]}
    />
  );
}

render(<App />, document.getElementById('app'));
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/react-ngw-maplibre-gl`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
