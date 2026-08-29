import { addQmsLayer } from '@nextgis/qms-maplibre-gl';
import { Map as MaplibreMap, NavigationControl } from 'maplibre-gl';

import type { QmsMaplibreLayer } from '@nextgis/qms-maplibre-gl';

const map = new MaplibreMap({
  container: 'map',
  style: { version: 8, sources: {}, layers: [] },
  center: [0, 20],
  zoom: 2,
});
map.addControl(new NavigationControl(), 'top-right');
const serviceSelect = document.getElementById('service') as HTMLSelectElement;
let activeLayer: QmsMaplibreLayer | undefined;

async function showService() {
  if (activeLayer) {
    activeLayer.remove();
  }
  const qmsId = Number(serviceSelect.selectedOptions[0].dataset.qmsId);
  activeLayer = await addQmsLayer(map, qmsId);
}

serviceSelect.addEventListener('change', showService);
map.on('load', showService);
