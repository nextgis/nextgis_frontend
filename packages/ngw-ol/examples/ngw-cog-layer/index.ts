import NgwMap from '@nextgis/ngw-ol';

NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
}).then((ngwMap) => {
  ngwMap.addNgwLayer({
    resource: 5511, // resource is the raster
    adapter: 'COG',
    fit: true,
  });
});
