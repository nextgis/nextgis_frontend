import { createQmsControl } from '@nextgis/qms-leaflet';
import { map as createMap } from 'leaflet';

const map = createMap('map').setView([20, 0], 2);

const control = createQmsControl({
  initialLayer: 448,
  // Or register a layer that is already added to the map:
  // initialLayer: () => existingLayer,
  // position: 'topright',
  // search: false,
  // catalog: false,
  // closeOnSelect: true,
  // lang: 'it',
  // limit: 20,
});
control.addTo(map);
