import NgwMap from '@nextgis/ngw-ol';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    {
      resource: 5152,
      fit: true,
      adapterOptions: {
        paint: {
          color: 'black',
          fillOpacity: [
          'interpolate',
          ['linear'],
          ['get', 'val'],
            6, 0.1,
            120, 0.6,
          ],
        },
      },
    },
    {
      resource: 5150,
      fit: true,
      adapterOptions: {
        paint: {
          color: [
          'interpolate',
          ['linear'],
          ['get', 'val'],
            40, '#ed904d',
            60, '#e6e4f0',
            100, '#8e76b7',
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
