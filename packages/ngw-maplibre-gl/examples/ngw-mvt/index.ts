import NgwMap from '@nextgis/ngw-maplibre-gl';

const ngwMap = new NgwMap({
  baseUrl: 'https://sandbox.nextgis.com',
  target: 'map',
  osm: true,
  bounds: [-89.566844, 42.998071, -89.24684, 43.17995],
});
ngwMap.onLoad().then(() => {
  // so that vector tiles of all layers are loaded through a single request,
  // it is necessary to list the identifiers of all resources in the URL
  const mvtUrl =
    ngwMap.connector.options.baseUrl +
    '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
    'resource=' +
    [7, 9, 11].join(',');

  ngwMap.addLayer('MVT', {
    url: mvtUrl,
    sourceLayer: 'ngw:' + 11,
    type: 'polygon',
    paint: { color: 'red' },
  });
  ngwMap.addLayer('MVT', {
    url: mvtUrl,
    sourceLayer: 'ngw:' + 9,
    type: 'point',
    selectable: true,
    selectedPaint: { color: 'yellow', radius: 8 },
    paint: { color: 'green', radius: 6 },
  });
  ngwMap.addLayer('MVT', {
    url: mvtUrl,
    sourceLayer: 'ngw:' + 7,
    type: 'point',
    paint: { color: 'blue' },
  });
});
