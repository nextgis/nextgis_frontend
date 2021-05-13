// import '@nextgis/control-container/lib/control-container.css';
import 'ol/ol.css';

import MapAdapter from '@nextgis/ol-map-adapter';
import { VueNgwMap } from '@nextgis/vue-ngw-map';
import { NgwMap } from '@nextgis/ngw-map';

import Map from 'ol/Map';

import { Mixins, Prop, Component } from 'vue-property-decorator';

@Component
export class VueNgwOl extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
  @Prop({ type: Function, default: () => new MapAdapter() })
  readonly mapAdapter!: () => MapAdapter;
  _ngwMap!: NgwMap<Map>;
}
