import NgwMap from '@nextgis/ngw-leaflet';
NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com',
  auth: { login: 'ngf_test', password: 'ngf_test' },
  // Resource is a raster layer
  resources: [{ resource: 7692, adapter: 'TILE', fit: true }],
});
