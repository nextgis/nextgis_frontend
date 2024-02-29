import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { findNgwMapParent, propsBinder } from '../utils';

import type VueNgwMap from './VueNgwMap';
import type { NgwLayerAdapterType, ResourceAdapter } from '@nextgis/ngw-kit';
import type { AdapterOptions } from '@nextgis/webmap';
import type { CreateElement, VNode } from 'vue';

@Component
export class VueNgwResource extends Vue {
  @Prop({ type: Number }) resourceId!: string;
  @Prop({ type: Boolean, default: false }) fit!: boolean;
  @Prop({ type: String }) adapter!: NgwLayerAdapterType;
  @Prop({ type: Object, default: () => ({}) }) adapterOptions!: AdapterOptions;

  name = 'vue-ngw-resource';

  parentContainer!: VueNgwMap;

  layer?: ResourceAdapter;

  beforeDestroy(): void {
    if (this.parentContainer.ngwMap && this.layer) {
      this.parentContainer.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  async setResourceId(resourceId: string, oldId?: number): Promise<void> {
    const ngwMap = this.parentContainer.ngwMap;
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
      if (resourceId) {
        const fit = this.$props.fit ? !oldId : false;
        this.layer = await ngwMap.addNgwLayer({
          resource: Number(resourceId),
          adapter: this.$props.adapter,
          fit,
          adapterOptions,
        });
      }
    }
  }

  async mounted(): Promise<void> {
    const parent = this.$parent;
    if (parent) {
      this.parentContainer = findNgwMapParent(parent);
    }

    await this.setResourceId(this.$props.resourceId);

    propsBinder(this, this.$props);

    this.$nextTick(() => {
      this.$emit('ready', this.layer);
    });
  }

  render(h: CreateElement): VNode {
    return h('div', {});
  }
}

export default VueNgwResource;
