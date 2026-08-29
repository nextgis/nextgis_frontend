import { addQmsLayer, fitQmsService } from '@nextgis/qms-ol';
import Map from 'ol/Map.js';

const qmsId = 4646;
const map = new Map({
  target: 'map',
});

addQmsLayer(map, qmsId, { fit: true });
const fitButton = document.getElementById('fit') as HTMLButtonElement;

fitButton.addEventListener('click', () => {
  fitQmsService(map, qmsId);
});
