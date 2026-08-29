import NgwMap from '@nextgis/ngw-leaflet';

import type { IdentifyItem } from '@nextgis/ngw-kit';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  osm: true,
  resources: [
    { resource: 5148, fit: true, adapterOptions: { selectable: true } },
  ],
});

ngwMap.emitter.on('click', (e) => {
  ngwMap.cancelPromises('select', 'identify');
  ngwMap.removeLayer('geojson');
});

const setSelected = (items: IdentifyItem[]) => {
  ngwMap.removeLayer('geojson');
  items[0].geojson().then((feature) => {
    ngwMap.addGeoJsonLayer({ data: feature, id: 'geojson' });
  });
};

ngwMap.emitter.on('ngw:select', (e) => {
  if (e) {
    setSelected(e.getIdentifyItems());
  }
});
