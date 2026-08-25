import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 4005, // Resource is a raster style
    adapter: 'TILE',
    fit: true,
  });
});
