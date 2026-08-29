import { addQmsLayer } from '@nextgis/qms-ol';
import Map from 'ol/Map.js';
import { fromLonLat } from 'ol/proj.js';
import View from 'ol/View.js';

import type BaseLayer from 'ol/layer/Base.js';

const map = new Map({
  target: 'map',
  view: new View({ center: fromLonLat([0, 20]), zoom: 2 }),
});
const serviceSelect = document.getElementById('service') as HTMLSelectElement;
let activeLayer: BaseLayer | undefined;

async function showService() {
  if (activeLayer) {
    map.removeLayer(activeLayer);
  }
  const qmsId = Number(serviceSelect.selectedOptions[0].dataset.qmsId);
  activeLayer = await addQmsLayer(map, qmsId);
}

serviceSelect.addEventListener('change', showService);
showService();
