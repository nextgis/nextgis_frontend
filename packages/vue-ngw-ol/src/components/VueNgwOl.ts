import 'ol/ol.css';
import Map from 'ol/Map';
import { Mixins, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import MapAdapter from '@nextgis/ol-map-adapter';
import VueNgwMap from '@nextgis/vue-ngw-map';

@Component
export class VueNgwOl extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Object, default: () => new MapAdapter() })
  readonly mapAdapter!: MapAdapter;
}
