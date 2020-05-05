/**
 * @module vuetify-ngw-components
 */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateElement, VNode, VNodeData } from 'vue';

import NgwMap, { LayerAdapter, BaseLayerAdapter } from '@nextgis/ngw-map';
import { ResourceAdapter } from '@nextgis/ngw-kit';
// @ts-ignore
import { VSelect } from 'vuetify/lib';
import { debounce } from '@nextgis/utils';

export interface VueSelectItem {
  value: string | undefined;
  text: string;
}

@Component
export class BaseLayersSelect extends Vue {
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;
  @Prop({ type: Boolean, default: true }) allowEmpty!: boolean;
  @Prop({ type: String, default: '---' }) emptyLayerText!: string;

  items: VueSelectItem[] = [];

  active: string | false = false;

  protected __updateItems?: () => Promise<void>;
  protected _layers: Array<LayerAdapter | ResourceAdapter> = [];

  @Watch('active')
  setVisibleLayers(active: string) {
    const activeLayer = this._layers.find((x) => x.id === active);
    if (activeLayer) {
      this.ngwMap.showLayer(activeLayer);
    } else {
      const activeBaseLayer = this.ngwMap.getActiveBaseLayer();
      if (activeBaseLayer) {
        this.ngwMap.hideLayer(activeBaseLayer);
      }
    }
  }

  @Watch('ngwMap')
  updateNgwMap() {
    this.destroy();
    this.create();
  }

  mounted() {
    this.create();
  }

  beforeDestroy() {
    this.destroy();
  }

  render(h: CreateElement): VNode {
    const data: VNodeData = {
      props: {
        value: this.active,
      },
      on: {
        input: (event: any) => {
          this.active = event;
        },
      },
      attrs: { items: this.items, selectable: true },
      scopedSlots: {
        ...this.$scopedSlots,
        label: (props) => {
          const name = props.item.name;
          return h('span', {
            domProps: {
              innerHTML: name,
              title: name,
            },
          });
        },
      },
    };
    return h(VSelect, data, this.$slots.default);
  }

  async updateItems() {
    if (this.__updateItems) {
      this.__updateItems();
    }
  }

  protected create() {
    this.ngwMap.onLoad().then(() => {
      this.destroy();
      this.updateItems();
      const __updateItems = debounce(async () => {
        const items = await this._updateItems();
        this.items = items;
      });
      this.__updateItems = __updateItems;

      this.ngwMap.emitter.on('layer:add', __updateItems);
      this.ngwMap.emitter.on('layer:remove', __updateItems);
    });
  }

  protected destroy() {
    if (this.__updateItems) {
      this.ngwMap.emitter.off('layer:add', this.__updateItems);
      this.ngwMap.emitter.off('layer:remove', this.__updateItems);
    }
  }

  protected async _updateItems(): Promise<VueSelectItem[]> {
    await this.ngwMap.onLoad();
    const baseLayers: BaseLayerAdapter[] = [];
    const items: VueSelectItem[] = [];
    // this._layers = [];
    const layers = this.ngwMap.allLayers();
    const baseLayersIds = this.ngwMap.getBaseLayers();

    if (this.allowEmpty) {
      items.push({
        text: this.emptyLayerText,
        value: undefined,
      });
    }

    baseLayersIds.forEach((x) => {
      const baseLayer = layers[x];
      if (baseLayer) {
        baseLayers.push(baseLayer);
        items.push({
          value: baseLayer.id || '',
          text: baseLayer.options.name || baseLayer.id || '',
        });
        if (this.ngwMap.isLayerVisible(baseLayer)) {
          this.active = baseLayer.id || false;
        }
      }
    });
    this._layers = baseLayers;
    return items;
  }
}
