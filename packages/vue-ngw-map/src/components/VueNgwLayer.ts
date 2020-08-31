import Vue, { VNode, CreateElement } from 'vue';
import Component from 'vue-class-component';
import { Prop, InjectReactive } from 'vue-property-decorator';
import {
  AdapterOptions,
  LayerAdapters,
  LayerAdapter,
  LayerAdapterDefinition,
} from '@nextgis/webmap';
import { NgwMap } from '@nextgis/ngw-map';
import { propsBinder } from '../utils';

@Component
export class VueNgwLayer extends Vue {
  @Prop({ type: String }) adapter!: keyof LayerAdapters;
  @Prop({ type: Object, default: () => ({}) }) adapterOptions!: AdapterOptions;
  @Prop({ type: Boolean, default: false }) fit!: boolean;

  @InjectReactive() readonly ngwMap!: NgwMap;

  name = 'vue-ngw-layer';

  layer?: LayerAdapter;

  beforeDestroy(): void {
    if (this.ngwMap && this.layer) {
      this.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  addLayer(
    adapter: LayerAdapterDefinition,
    options: AdapterOptions = {}
  ): Promise<LayerAdapter> {
    return this.ngwMap.addLayer(adapter, options);
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
