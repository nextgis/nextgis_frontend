import '@nextgis/control-container/lib/control-container.css';
import 'ol/ol.css';

import MapAdapter from '@nextgis/ol-map-adapter';
import VueNgwMap from '@nextgis/vue-ngw-map';
import Map from 'ol/Map';

import { Mixins, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component
export class VueNgwOl extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Object, default: () => new MapAdapter() })
  readonly mapAdapter!: MapAdapter;
}
