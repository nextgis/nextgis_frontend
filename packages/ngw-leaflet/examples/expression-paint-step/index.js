import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    {
      resource: 5150,
      fit: true,
      adapterOptions: {
        limit: 300,
        paint: {
          color: [
            'step',
            ['get', 'val'],
            'gray',
            40, '#ed904d',
            41.8, '#f4a968',
            42.9, '#fbc183',
            49.1, '#fdd6a7',
            57.2, '#fbe8d0',
            62.6, '#f9f9f9',
            66.1, '#e6e4f0',
            70.5, '#d3cfe5',
            75.7, '#bdb5d8',
            79.3, '#a695c8',
            83.4, '#8e76b7',
          ],
          fillOpacity: 1,
          stroke: true,
          strokeColor: "black",
          radius: 6,
        },
      },
    },
  ],
});
