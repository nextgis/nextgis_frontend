import NgwMap from '@nextgis/ngw-leaflet';
import L from 'leaflet';

import '@geoman-io/leaflet-geoman-free';

const bounds = [37.65972, 55.7299, 37.66735, 55.73278];
NgwMap.create({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  bounds,
}).then((ngwMap) => {
  console.log(L.PM);

  const map = ngwMap.mapAdapter.map;
  if (!map) throw new Error('Leaflet map is unavailable');
  map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
  });
});
