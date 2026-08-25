import NgwMap from '@nextgis/ngw-ol';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  resources: [
    {
      resource: 4224,
      fit: true,
      adapterOptions: {
        interactive: false,
        labelField: 'NAME',
      },
    },
  ],
  osm: true,
});
