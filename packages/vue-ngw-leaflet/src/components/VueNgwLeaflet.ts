import L, { Map } from 'leaflet';
import { Mixins, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import MapAdapter from '@nextgis/leaflet-map-adapter';
import { VueNgwMap } from '@nextgis/vue-ngw-map';

import 'leaflet/dist/leaflet.css';
const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.default,
  iconUrl: iconUrl.default,
  shadowUrl: shadowUrl.default
});

@Component
export class VueNgwLeaflet extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Object, default: () => new MapAdapter() })
  mapAdapter!: MapAdapter;
}
