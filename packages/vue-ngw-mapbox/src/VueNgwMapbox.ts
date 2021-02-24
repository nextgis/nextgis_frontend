import 'mapbox-gl/dist/mapbox-gl.css';

import { Map } from 'mapbox-gl';
import { Mixins, Prop, Component } from 'vue-property-decorator';
import { VueNgwMap } from '@nextgis/vue-ngw-map';
// import { NgwMap } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/mapboxgl-map-adapter';

@Component
export class VueNgwMapbox extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Function, default: () => new MapAdapter() })
  mapAdapter!: () => MapAdapter;
  // ngwMap!: NgwMap<Map>;
}
