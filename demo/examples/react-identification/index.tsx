import ReactNgwMap from '@nextgis/react-ngw-leaflet';
import { MapControl, ReactGeojsonLayer } from '@nextgis/react-ngw-map';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { IdentifyItem } from '@nextgis/ngw-kit';
import type { GeometryPaint } from '@nextgis/paint';

type SelectedFeature = Awaited<ReturnType<IdentifyItem['geojson']>>;
type Attribute = { label: string; value: unknown };

const resources = [
  { resource: 6245, fit: true, adapterOptions: { selectable: true } },
];
const highlightPaint: GeometryPaint = {
  color: 'orange',
  opacity: 0.8,
  weight: 2,
  radius: 6,
};

function App() {
  const [items, setItems] = useState<IdentifyItem[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feature, setFeature] = useState<SelectedFeature | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [identifying, setIdentifying] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string>();

  const selected = items?.[selectedIndex];

  useEffect(() => {
    setFeature(null);
    setAttributes([]);
    setLoadingDetails(Boolean(selected));
    if (!selected) return;

    const controller = new AbortController();
    Promise.all([
      selected.geojson({ signal: controller.signal }),
      selected.resource({ signal: controller.signal }),
    ])
      .then(([geojson, resource]) => {
        if (controller.signal.aborted) return;
        setFeature(geojson);
        setAttributes(
          resource.fields.map((field) => ({
            label: field.display_name || field.keyname,
            value: geojson.properties?.[field.keyname],
          })),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Could not load the selected feature.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingDetails(false);
      });

    return () => controller.abort();
  }, [selected]);

  return (
    <ReactNgwMap
      className="map"
      baseUrl="https://demo.nextgis.com"
      qmsId={448}
      resources={resources}
      onIdentifyStart={() => {
        setItems(null);
        setSelectedIndex(0);
        setFeature(null);
        setIdentifying(true);
        setError(undefined);
      }}
      onIdentify={(found) => {
        setItems(found);
        setSelectedIndex(0);
        setIdentifying(false);
      }}
      onIdentifyError={() => {
        setItems(null);
        setIdentifying(false);
        setError('Could not identify features. Please try again.');
      }}
    >
      <ReactGeojsonLayer
        id="identified-feature"
        data={feature}
        paint={highlightPaint}
        selectable={false}
        interactive={false}
        order={999}
      />

      <MapControl position="top-right">
        <div className="identify-panel" aria-live="polite">
          <h1>Identification</h1>
          {identifying ? (
            <p>Identifying…</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : items === null ? (
            <p>Click on the map to identify features.</p>
          ) : items.length === 0 ? (
            <p>No features found.</p>
          ) : (
            <>
              <label htmlFor="feature-select">Object</label>
              <select
                id="feature-select"
                value={selectedIndex}
                onChange={(event) => {
                  setError(undefined);
                  setSelectedIndex(Number(event.target.value));
                }}
              >
                {items.map((item, index) => (
                  <option
                    key={`${item.layerId}:${item.id}:${index}`}
                    value={index}
                  >
                    {item.label || `Feature ${item.id}`}
                  </option>
                ))}
              </select>

              {loadingDetails ? (
                <p>Loading feature…</p>
              ) : (
                <dl>
                  {attributes.map(({ label, value }, index) => (
                    <React.Fragment key={`${label}:${index}`}>
                      <dt>{label}</dt>
                      <dd>{value == null ? '—' : String(value)}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              )}
            </>
          )}
        </div>
      </MapControl>
    </ReactNgwMap>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(<App />);
