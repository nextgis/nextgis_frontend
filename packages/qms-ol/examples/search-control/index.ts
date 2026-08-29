import { createQmsControl } from '@nextgis/qms-ol';
import Map from 'ol/Map.js';
import { fromLonLat } from 'ol/proj.js';
import View from 'ol/View.js';

const map = new Map({
  target: 'map',
  view: new View({ center: fromLonLat([0, 20]), zoom: 2 }),
});

const control = createQmsControl({
  initialLayer: 448,
  // Or register a layer that is already added to the map:
  // initialLayer: () => existingLayer,
  // search: false,
  // catalog: false,
  // closeOnSelect: true,
  // lang: 'ru',
  // limit: 20,
});
map.addControl(control);
