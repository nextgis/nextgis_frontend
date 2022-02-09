import 'maplibre-gl/dist/maplibre-gl.css';

import { Mixins, Prop, Component } from 'vue-property-decorator';
import { VueNgwMap } from '@nextgis/vue-ngw-map';
// import { NgwMap } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/mapboxgl-map-adapter';
import type { Map } from 'maplibre-gl';

@Component
export class VueNgwMapbox extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Function, default: () => new MapAdapter() })
  mapAdapter!: () => MapAdapter;
  // ngwMap!: NgwMap<Map>;
}
