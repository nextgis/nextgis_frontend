# ReactNgwLeaflet

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/react-ngw-leaflet) ![version](https://img.shields.io/npm/v/@nextgis/react-ngw-leaflet)

Plugin to integrate NGW maps into React with leaflet adapter

## Installation

```bash
npm install leaflet @nextgis/react-ngw-leaflet
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import ReactNgwMap from '@nextgis/react-ngw-leaflet';

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

Need to fix a bug or add a feature to `@nextgis/react-ngw-leaflet`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
