import Vue, { VNode, CreateElement } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { findNgwMapParent, propsBinder } from '../utils';
import { ResourceAdapter, NgwLayerAdapterType } from '@nextgis/ngw-kit';
import VueNgwMap from './VueNgwMap';
import { AdapterOptions } from '@nextgis/webmap';

@Component
export class VueNgwResource extends Vue {
  name = 'vue-ngw-resource';

  @Prop({ type: Number }) resourceId!: string;
  @Prop({ type: Boolean, default: false }) fit!: boolean;
  @Prop({ type: String }) adapter!: NgwLayerAdapterType;
  @Prop({ type: Object, default: () => ({}) }) adapterOptions!: AdapterOptions;

  parentContainer!: VueNgwMap;

  layer?: ResourceAdapter;

  beforeDestroy() {
    if (this.parentContainer.ngwMap && this.layer) {
      this.parentContainer.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  async setResourceId(resourceId: string, oldId?: number) {
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
          resourceId: Number(resourceId),
          adapter: this.$props.adapter,
          fit,
          adapterOptions
        });
      }
    }
  }

  async mounted() {
    this.parentContainer = findNgwMapParent(this.$parent);

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
