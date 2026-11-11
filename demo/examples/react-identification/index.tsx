import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { IdentifyItem } from '@nextgis/ngw-kit';

const resources = [
  { resource: 7003, fit: true, adapterOptions: { selectable: true } },
];

function App() {
  const [items, setItems] = useState<IdentifyItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div className="app">
      <ReactNgwMap
        className="map"
        baseUrl="https://demo.nextgis.com"
        osm
        resources={resources}
        onIdentifyStart={() => {
          setItems(null);
          setLoading(true);
          setError(undefined);
        }}
        onIdentify={(identified) => {
          setItems(identified);
          setLoading(false);
        }}
        onIdentifyError={() => {
          setItems(null);
          setLoading(false);
          setError('Could not identify features. Please try again.');
        }}
      />
      <aside aria-live="polite">
        <h1>Identification</h1>
        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : items === null ? (
          <p>Click on the map to identify features.</p>
        ) : items.length === 0 ? (
          <p>No features found.</p>
        ) : (
          items.map((item) => (
            <article key={`${item.layerId}:${item.id}`}>
              <h2>{item.label || `Feature ${item.id}`}</h2>
              <p>Data layer: {item.layerId}</p>
              <pre>{JSON.stringify(item.fields, null, 2)}</pre>
            </article>
          ))
        )}
      </aside>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(<App />);
