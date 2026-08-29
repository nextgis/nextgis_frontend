import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 1300,
  resources: [
    {
      resource: 1733,
      fit: true,
      adapterOptions: {
        limit: 300,
        paint: {
          color: [
            'match',
            ['get', 'AMENITY'],
            'cafe',
            'blue',
            'restaurant',
            'red',
            'gray', // last item is default value
          ],
          fillOpacity: 0.6,
          stroke: true,
          radius: 6,
        },
      },
    },
  ],
});
