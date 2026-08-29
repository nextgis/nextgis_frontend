import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import { createQmsAdapter } from '@nextgis/qms-kit';
import { createWebMap } from '@nextgis/webmap';

createWebMap({
  mapAdapter: new LeafletMapAdapter(),
  target: 'map',
  zoom: 6,
  center: [104, 52],
}).then((webMap) => {
  webMap.addBaseLayer(createQmsAdapter({ webMap, qmsId: 448 }));
});
