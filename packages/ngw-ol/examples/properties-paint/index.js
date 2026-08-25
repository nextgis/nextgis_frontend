import NgwMap from '@nextgis/ngw-ol';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  resources: [
    {
      resource: 1733,
      adapterOptions: {
        paint: [
          { radius: 6, stroke: true, fillOpacity: 0.5 },
          [[['AMENITY', 'eq', 'restaurant']], { color: 'green' }],
          [[['AMENITY', 'eq', 'cafe']], { color: 'red' }],
        ],
        fit: true,
        limit: 300,
      },
    },
  ],
});
