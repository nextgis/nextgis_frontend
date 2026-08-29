import { addQmsLayer, fitQmsService } from '@nextgis/qms-maplibre-gl';
import { Map as MaplibreMap, NavigationControl } from 'maplibre-gl';

const qmsId = 4646;
const map = new MaplibreMap({
  container: 'map',
  style: { version: 8, sources: {}, layers: [] },
});
map.addControl(new NavigationControl(), 'top-left');

map.on('load', () => addQmsLayer(map, qmsId, { fit: true }));
const fitButton = document.getElementById('fit') as HTMLButtonElement;

fitButton.addEventListener('click', () => {
  fitQmsService(map, qmsId);
});
