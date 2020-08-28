import Vue, { VNode, CreateElement } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AdapterOptions, LayerAdapters, LayerAdapter } from '@nextgis/webmap';
import VueNgwMap from './VueNgwMap';
import { findNgwMapParent, propsBinder } from '../utils';

@Component
export class VueNgwLayer extends Vue {
  @Prop({ type: String }) adapter!: keyof LayerAdapters;
  @Prop({ type: Object, default: () => ({}) }) adapterOptions!: AdapterOptions;
  @Prop({ type: Boolean, default: false }) fit!: boolean;

  name = 'vue-ngw-layer';

  parentContainer!: VueNgwMap;

  layer?: LayerAdapter;

  beforeDestroy(): void {
    if (this.parentContainer.ngwMap && this.layer) {
      this.parentContainer.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  async setLayer(): Promise<void> {
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

      const fit = this.$props.fit;
      this.layer = await ngwMap.addLayer(this.$props.adapter, {
        fit,
        adapterOptions,
      });
    }
  }

  async mounted(): Promise<void> {
    this.parentContainer = findNgwMapParent(this.$parent);

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
