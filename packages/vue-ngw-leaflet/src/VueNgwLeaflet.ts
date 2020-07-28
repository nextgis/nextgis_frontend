import { Map, Icon } from 'leaflet';
import { Mixins, Prop, Component } from 'vue-property-decorator';
import MapAdapter from '@nextgis/leaflet-map-adapter';
import { VueNgwMap } from '@nextgis/vue-ngw-map';
import { NgwMap } from '@nextgis/ngw-map';

import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

@Component
export class VueNgwLeaflet extends Mixins(VueNgwMap) implements VueNgwMap<Map> {
  @Prop({ type: Object, default: () => new MapAdapter() })
  mapAdapter!: MapAdapter;
  ngwMap: NgwMap<Map> | null = null;
}
