import { addQmsLayer, fitQmsService } from '@nextgis/qms-leaflet';
import { map as createMap } from 'leaflet';

const qmsId = 4646;
const map = createMap('map');

addQmsLayer(map, qmsId, { fit: true });
const fitButton = document.getElementById('fit') as HTMLButtonElement;

fitButton.addEventListener('click', () => {
  fitQmsService(map, qmsId);
});
