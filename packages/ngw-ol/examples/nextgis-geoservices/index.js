import NgwMap from '@nextgis/ngw-ol';
// This key for demonstrations only
const apiKey = '9da237c7a0b3c1d369a62b7ec95674b5';
NgwMap.create({
  target: 'map',
  center: [-89.4008, 43.0722],
  zoom: 8,
}).then((ngwMap) => {
  ngwMap.addLayer('TILE', {
    url:
      'https://tilehub.nextgis.com/raster/tile/8/{z}/{x}/{y}.png?apikey=' +
      apiKey,
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
});
