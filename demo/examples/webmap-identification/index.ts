import NgwMap from '@nextgis/ngw-leaflet';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  resources: [
    { resource: 4226, fit: true, adapterOptions: { selectable: true } },
  ],
});
// Stop all current identification requests on each click before making new requests
ngwMap.emitter.on('click', (e) => {
  ngwMap.cancelPromises('select', 'identify');
  ngwMap.removeLayer('geojson');
});
ngwMap.emitter.on('ngw:select', (e) => {
  if (e) {
    ngwMap.fetchIdentifyGeoJson(e).then((geojson) => {
      ngwMap.addGeoJsonLayer({ data: geojson, id: 'geojson' });
    });
  }
});
