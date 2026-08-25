import NgwMap from '@nextgis/ngw-ol';
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
            'case',
            ['<=', ['get', 'val'], 50], '#ff0000',  // red if val <= 50
            ['all', ['>=', ['get', 'val'], 50], ['<=', ['get', 'val'], 60]], '#00ff00',  // green if 50 <= val <= 60
            ['all', ['>=', ['get', 'val'], 60], ['<=', ['get', 'val'], 80]], '#0000ff',  // blue if 60 <= val <= 80
            '#ffffff'  // default color (white)
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
