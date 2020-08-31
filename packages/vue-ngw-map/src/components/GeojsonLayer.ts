import { GeoJsonObject } from 'geojson';
import Component from 'vue-class-component';
import { Prop, Mixins, Watch } from 'vue-property-decorator';

import {
  LayerAdapters,
  LayerAdapter,
  VectorLayerAdapter,
  AdapterOptions,
} from '@nextgis/webmap';
import { VueNgwLayer } from './VueNgwLayer';

@Component
export class GeojsonLayer extends Mixins(VueNgwLayer) {
  @Prop({ type: String, default: 'GEOJSON' }) adapter!: keyof LayerAdapters;
  @Prop({ default: 'GEOJSON' }) data!: GeoJsonObject;

  name = 'geojson-layer';

  // parentContainer!: VueNgwMap;

  layer?: VectorLayerAdapter;

  @Watch('data')
  onDataChange(data: GeoJsonObject): void {
    if (this.layer) {
      this.ngwMap.setLayerData(this.layer, data);
    }
  }

  addLayer(
    adapter: 'GEOJSON',
    options: AdapterOptions = {}
  ): Promise<LayerAdapter> {
    return this.ngwMap.addLayer(adapter, { ...options, data: this.data });
  }
}
