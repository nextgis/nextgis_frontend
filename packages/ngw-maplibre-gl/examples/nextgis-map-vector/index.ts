import NgwMap from '@nextgis/ngw-maplibre-gl';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
});
ngwMap
  .addNgwLayer({
    resource: 4005,
  })
  .then(function (layer) {
    if (!layer) throw new Error('Layer was not created');
    ngwMap.fitLayer(layer);
  });
