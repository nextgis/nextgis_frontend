import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import { QmsKit } from '@nextgis/qms-kit';
import { createWebMap, getDefaultControls } from '@nextgis/webmap';

import type { QmsAdapterOptions } from '@nextgis/qms-kit';

createWebMap({
  mapAdapter: new LeafletMapAdapter(),
  target: 'map',
  controls: getDefaultControls(),
  starterKits: [new QmsKit()],
  center: [104, 52],
  zoom: 6,
}).then(function (map) {
  map.addBaseLayer('QMS', { qmsId: 448 } as QmsAdapterOptions);
});
