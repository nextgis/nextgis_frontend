import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  osm: true,
  target: 'map',
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 4158, // Resource is postgis layer
    // adapter: 'GEOJSON', // GEOJSON by default, TILE adn VECTOR
    fit: true,
  });
});
