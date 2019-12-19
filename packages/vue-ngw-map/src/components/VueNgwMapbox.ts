import 'mapbox-gl/dist/mapbox-gl.css';

import { Map } from 'mapbox-gl';
import { Mixins, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { VueNgwMapBase } from './VueNgwMapBase';

import MapAdapter from '@nextgis/mapboxgl-map-adapter';

@Component
export class VueNgwMapbox extends Mixins<VueNgwMapBase<Map>>(VueNgwMapBase) {
  @Prop({ type: Object, default: () => new MapAdapter() })
  mapAdapter!: MapAdapter;
}
