import NgwMap from '@nextgis/ngw-maplibre-gl';
// This key for demonstrations only
const apiKey = '67f622354b0e6302cb2b59f4d1b634e8';
NgwMap.create({
  target: 'map',
  center: [-89.4008, 43.0722],
  zoom: 8,
}).then((ngwMap) => {
  ngwMap.addLayer('TILE', {
    url:
      'https://geoservices.nextgis.com/raster/osm/klokantech-3d/{z}/{x}/{y}.png?apikey=' +
      apiKey,
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
});
