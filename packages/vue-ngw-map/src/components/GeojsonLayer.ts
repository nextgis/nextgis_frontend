import { GeoJsonObject } from 'geojson';
import Component from 'vue-class-component';
import { Prop, Mixins, Watch, Emit, Model } from 'vue-property-decorator';

import { VueNgwLayer } from './VueNgwLayer';

import type { Paint } from '@nextgis/paint';
import type {
  LayerAdapters,
  LayerAdapter,
  VectorLayerAdapter,
  OnLayerClickOptions,
  VectorAdapterOptions,
} from '@nextgis/webmap';

@Component
export class GeojsonLayer extends Mixins(VueNgwLayer) {
  @Model('change') readonly selected!: number[];
  @Prop({ type: String, default: 'GEOJSON' }) adapter!: keyof LayerAdapters;
  @Prop({ default: 'GEOJSON' }) data!: GeoJsonObject;
  @Prop({ default: 'id' }) readonly idField!: string;
  @Prop() readonly paint!: Paint;

  name = 'geojson-layer';

  layer?: VectorLayerAdapter;

  @Watch('data')
  onDataChange(data: GeoJsonObject): void {
    if (this.layer && this.ngwMap) {
      this.ngwMap.setLayerData(this.layer, data);
    }
  }

  @Watch('selected')
  onSelectedChange(): void {
    if (this.layer && this.layer.select) {
      this.layer.select((e) => {
        if (e.feature && e.feature.properties) {
          return (
            this.selected.indexOf(e.feature.properties[this.idField]) !== -1
          );
        }
        return false;
      });
    }
  }

  @Emit('click')
  onLayerClick(opt: OnLayerClickOptions): OnLayerClickOptions {
    this.selectedChange();
    return opt;
  }

  @Emit('change')
  selectedChange(): (string | number)[] {
    const selected: (number | string)[] = [];
    if (this.layer && this.layer.getSelected) {
      this.layer.getSelected().forEach((x) => {
        if (x.feature) {
          let key = x.feature.properties && x.feature.properties[this.idField];
          key = key !== undefined ? key : x.feature.id;
          if (key !== undefined) {
            selected.push(key);
          }
        }
      });
    }
    return selected;
  }

  addLayer(
    adapter: 'GEOJSON',
    options: VectorAdapterOptions = {},
  ): Promise<LayerAdapter | undefined> {
    if (this.paint) {
      options.paint = this.paint;
    }
    return Promise.resolve(
      this.ngwMap &&
        this.ngwMap
          .addLayer(adapter, {
            ...options,
            data: this.data,
            onClick: this.onLayerClick,
          })
          .then((layer) => {
            this.onSelectedChange();
            return layer;
          }),
    );
  }
}
