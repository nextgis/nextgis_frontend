import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import { QmsKit } from '@nextgis/qms-kit';
import { createWebMap } from '@nextgis/webmap';

import type { QmsAdapterOptions } from '@nextgis/qms-kit';

createWebMap({
  mapAdapter: new LeafletMapAdapter(),
  target: 'map',
  zoom: 6,
  center: [104, 52],
  starterKits: [new QmsKit()],
}).then(function (map) {
  map.addBaseLayer('QMS', { qmsId: 448 } as QmsAdapterOptions);
});
