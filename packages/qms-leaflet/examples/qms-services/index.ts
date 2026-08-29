import { addQmsLayer } from '@nextgis/qms-leaflet';
import { map as createMap } from 'leaflet';

import type { Layer } from 'leaflet';

const map = createMap('map').setView([20, 0], 2);
const serviceSelect = document.getElementById('service') as HTMLSelectElement;
let activeLayer: Layer | undefined;

async function showService() {
  if (activeLayer) {
    map.removeLayer(activeLayer);
  }
  const qmsId = Number(serviceSelect.selectedOptions[0].dataset.qmsId);
  activeLayer = await addQmsLayer(map, qmsId);
}

serviceSelect.addEventListener('change', showService);
showService();
