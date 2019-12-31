import L, { Map } from 'leaflet';
import { Mixins, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import MapAdapter from '@nextgis/leaflet-map-adapter';
import { VueNgwMap } from '@nextgis/vue-ngw-map';

import 'leaflet/dist/leaflet.css';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

@Component
export class VueNgwLeaflet extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Object, default: () => new MapAdapter() })
  mapAdapter!: MapAdapter;
}
