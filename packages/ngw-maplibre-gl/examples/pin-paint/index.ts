import NgwMap from '@nextgis/ngw-maplibre-gl';

new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  resources: [
    {
      resource: 1733,
      adapterOptions: {
        paint: [
          { type: 'pin' },
          [[['AMENITY', 'eq', 'restaurant']], { color: 'green' }],
          [[['AMENITY', 'eq', 'cafe']], { color: 'red' }],
        ],
        fit: true,
        limit: 100,
      },
    },
  ],
});
