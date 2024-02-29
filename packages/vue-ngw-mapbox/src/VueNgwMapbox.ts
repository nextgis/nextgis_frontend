import 'maplibre-gl/dist/maplibre-gl.css';

import MapAdapter from '@nextgis/mapboxgl-map-adapter';
import { VueNgwMap } from '@nextgis/vue-ngw-map';
import { Component, Mixins, Prop } from 'vue-property-decorator';
// import { NgwMap } from '@nextgis/ngw-map';

import type { Map } from 'maplibre-gl';

@Component
export class VueNgwMapbox extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Function, default: () => new MapAdapter() })
  mapAdapter!: () => MapAdapter;
  // ngwMap!: NgwMap<Map>;
}
