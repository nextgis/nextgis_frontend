import NgwMap from '@nextgis/ngw-ol';

NgwMap.create({
  target: 'map',
  osm: true,
  baseUrl: 'https://demo.nextgis.com',
  resources: [
    {
      resource: 4222,
      fit: true,
      adapterOptions: {
        selectable: true,
        limit: 100,
        paint: { color: 'red' },
        nativeOptions: {
          updateWhileInteracting: true,
          updateWhileAnimating: true,
        },
      },
    },
  ],
});
