import NgwMap from '@nextgis/ngw-maplibre-gl';
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
