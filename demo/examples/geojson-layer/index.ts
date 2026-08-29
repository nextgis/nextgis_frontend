import NgwMap from '@nextgis/ngw-leaflet';

import type { FeatureCollection } from 'geojson';

const boat = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [107.12654, 53.21777],
              [107.14559, 53.20551],
              [107.22415, 53.20836],
              [107.25034, 53.22461],
              [107.25034, 53.22461],
              [107.12654, 53.21777],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [107.18797, 53.22148],
              [107.18368, 53.26137],
              [107.23225, 53.24143],
              [107.18797, 53.22148],
            ],
          ],
        ],
      },
    },
  ],
} satisfies FeatureCollection;
const waves = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [107.22412, 53.20843],
            [107.20972, 53.21402],
            [107.19198, 53.20736],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [107.18377, 53.207],
            [107.16699, 53.21248],
            [107.1527, 53.20581],
          ],
        ],
      },
    },
  ],
} satisfies FeatureCollection;
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  center: [107.17, 53.22],
  zoom: 12,
}).then((ngwMap) => {
  ngwMap.addGeoJsonLayer({ data: boat, paint: { color: 'red' } });
  ngwMap.addGeoJsonLayer({
    data: waves,
    paint: { color: 'blue', opacity: 0.8, weight: 3 },
  });
  ngwMap.addGeoJsonLayer({
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [107.19044, 53.25057] },
    },
    paint: { color: 'green', radius: 6 },
  });
  ngwMap.addGeoJsonLayer({
    data: { type: 'Point', coordinates: [107.20615, 53.24343] },
    paint: { color: 'yellow', radius: 8 },
  });
  ngwMap.addGeoJsonLayer({
    data: { type: 'Point', coordinates: [107.19401, 53.2339] },
    // use the icon to paint the point geometry
    paint: NgwMap.getIcon({ color: 'orange' }),
  });
  // Add geojson layer from NGW vector resource
  ngwMap.addNgwLayer({
    resource: 4038,
    adapter: 'GEOJSON',
    adapterOptions: {
      // use callback to set paint dynamically
      paint: (feature) => {
        return {
          color: 'rgb(126, 192, ' + Math.round(Math.random() * 255) + ')',
          opacity: 1,
        };
      },
    },
  });
});
