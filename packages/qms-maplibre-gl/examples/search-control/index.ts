import { createQmsControl } from '@nextgis/qms-maplibre-gl';
import { Map as MaplibreMap, NavigationControl } from 'maplibre-gl';

const map = new MaplibreMap({
  container: 'map',
  style: { version: 8, sources: {}, layers: [] },
  center: [0, 20],
  zoom: 2,
});
map.addControl(new NavigationControl(), 'top-right');

const control = createQmsControl({
  initialLayer: 448,
  // Or register a layer that is already added to the map:
  // initialLayer: () => existingLayer,
  // search: false,
  // catalog: false,
  // closeOnSelect: true,
  // lang: 'it',
  // limit: 20,
});
map.addControl(control, 'top-left');
