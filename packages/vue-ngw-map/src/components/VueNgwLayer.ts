import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { findNgwMapParent, propsBinder } from '../utils';

import type VueNgwMap from './VueNgwMap';
import type { NgwMap } from '@nextgis/ngw-map';
import type {
  AdapterOptions,
  LayerAdapter,
  LayerAdapterDefinition,
  LayerAdapters,
} from '@nextgis/webmap';
import type { CreateElement, VNode } from 'vue';

@Component
export class VueNgwLayer extends Vue {
  @Prop({ type: String }) adapter!: keyof LayerAdapters;
  @Prop({ type: Object, default: () => ({}) }) adapterOptions!: AdapterOptions;
  @Prop({ type: Boolean, default: false }) fit!: boolean;

  // @InjectReactive() readonly ngwMap!: NgwMap;

  parentContainer?: VueNgwMap;
  name = 'vue-ngw-layer';
  layer?: LayerAdapter;

  get ngwMap(): NgwMap | undefined {
    return this.parentContainer && this.parentContainer.ngwMap;
  }

  beforeDestroy(): void {
    if (this.ngwMap && this.layer) {
      this.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  addLayer(
    adapter: LayerAdapterDefinition,
    options: AdapterOptions = {},
  ): Promise<LayerAdapter | undefined> {
    return Promise.resolve(
      this.ngwMap && this.ngwMap.addLayer(adapter, options),
    );
  }

  async setLayer(): Promise<void> {
    const ngwMap = this.ngwMap;
    const layer = this.layer;
    let order: number | undefined;
    if (ngwMap) {
      if (layer) {
        order = layer.options.order;
        ngwMap.removeLayer(layer);
      }
      const adapterOptions: AdapterOptions = { ...this.$props.adapterOptions };
      if (order) {
        adapterOptions.order = order;
      }

      const fit = this.$props.fit;
      this.layer = await this.addLayer(this.$props.adapter, {
        fit,
        ...adapterOptions,
      });
    }
  }

  async mounted(): Promise<void> {
    const parent = this.$parent;
    if (parent) {
      this.parentContainer = findNgwMapParent(parent);
    }
    await this.setLayer();

    propsBinder(this, this.$props);

    this.$nextTick(() => {
      this.$emit('ready', this.layer);
    });
  }

  render(h: CreateElement): VNode {
    return h('div', {});
  }
}
