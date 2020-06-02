/**
 * @module vuetify-ngw-components
 */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateElement, VNode, VNodeData } from 'vue';

import WebMap from '@nextgis/webmap';
import { LayerAdapter, BaseLayerAdapter } from '@nextgis/ngw-map';
import { ResourceAdapter } from '@nextgis/ngw-kit';
// @ts-ignore
import { VSelect } from 'vuetify/lib';
import { debounce } from '@nextgis/utils';

export interface VueSelectItem {
  value: string | undefined;
  text: string;
}

const emptyValue = '___empty_value___';

@Component
export class BasemapSelect extends Vue {
  @Prop({ type: WebMap }) webMap!: WebMap;
  @Prop({ type: Boolean, default: true }) allowEmpty!: boolean;
  @Prop({ type: String, default: '---' }) emptyLayerText!: string;

  items: VueSelectItem[] = [];

  active: string | false = emptyValue;

  protected __updateItems?: () => Promise<void>;
  protected _layers: Array<LayerAdapter | ResourceAdapter> = [];

  @Watch('active')
  setVisibleLayers(active: string) {
    const activeLayer = this._layers.find((x) => x.id === active);
    if (activeLayer) {
      this.webMap.showLayer(activeLayer);
    } else {
      const activeBaseLayer = this.webMap.getActiveBaseLayer();
      if (activeBaseLayer) {
        this.webMap.hideLayer(activeBaseLayer);
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
    this.webMap.onLoad().then(() => {
      this.destroy();
      const __updateItems = debounce(async () => {
        const items = await this._updateItems();
        this.items = items;
      });
      this.__updateItems = __updateItems;
      this.updateItems();
      this.webMap.emitter.on('layer:add', __updateItems);
      this.webMap.emitter.on('layer:remove', __updateItems);
    });
  }

  protected destroy() {
    if (this.__updateItems) {
      this.webMap.emitter.off('layer:add', this.__updateItems);
      this.webMap.emitter.off('layer:remove', this.__updateItems);
    }
  }

  protected async _updateItems(): Promise<VueSelectItem[]> {
    await this.webMap.onLoad();
    const baseLayers: BaseLayerAdapter[] = [];
    const items: VueSelectItem[] = [];
    const layers = this.webMap.allLayers();
    const baseLayersIds = this.webMap.getBaseLayers();

    if (this.allowEmpty) {
      items.push({
        text: this.emptyLayerText,
        value: emptyValue,
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
        if (baseLayer.id && this.webMap.isLayerVisible(baseLayer)) {
          this.active = baseLayer.id;
        }
      }
    });
    this._layers = baseLayers;
    return items;
  }
}
