import NgwMap from '@nextgis/ngw-ol';
NgwMap.create({
  osm: true,
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  resources: [
    {
      resource: 4980,
      fit: true,
    },
  ],
});
