import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <ReactNgwMap
    baseUrl="https://demo.nextgis.com"
    qmsId={448}
    resources={[{ resource: 1733, fit: true }]}
    style={{ width: '100%', height: '100%' }}
  />,
);
