import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateElement, VNode, VNodeData } from 'vue';

import { WebMap } from '@nextgis/webmap';
import { LayerAdapter, MainLayerAdapter } from '@nextgis/ngw-map';
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
export class BaselayerSelect extends Vue {
  @Prop({ type: Number }) webMapId!: number;
  @Prop({ type: Boolean, default: true }) allowEmpty!: boolean;
  @Prop({ type: String, default: '---' }) emptyLayerText!: string;

  items: VueSelectItem[] = [];

  emptyValue = emptyValue;

  active: string | false = emptyValue;

  protected __updateItems?: () => Promise<void>;
  protected _layers: Array<LayerAdapter | ResourceAdapter> = [];

  get webMap(): WebMap {
    return WebMap.get(this.webMapId);
  }

  @Watch('active')
  setVisibleLayers(active: string, old: string): void {
    if (active === old) return;
    const activeLayer = this._layers.find((x) => x.id === active);
    if (this.webMap) {
      if (activeLayer) {
        this.webMap.showLayer(activeLayer);
      } else {
        const activeBaseLayer = this.webMap.getActiveBaseLayer();
        if (activeBaseLayer) {
          this.webMap.hideLayer(activeBaseLayer);
        }
      }
    }
  }

  @Watch('webMap')
  updateWebMap(): void {
    this.destroy();
    this.create();
  }

  mounted(): void {
    this.create();
  }

  beforeDestroy(): void {
    this.destroy();
  }

  render(h: CreateElement): VNode {
    const data: VNodeData = {
      props: {
        value: this.active,
      },
      on: {
        input: (event: any) => {
          if (this.active !== event) {
            this.active = event;
          }
        },
      },
      attrs: {
        ...this.$attrs,
        items: this.items,
        selectable: true,
        'hide-details': true,
      },
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

  async updateItems(): Promise<void> {
    if (this.__updateItems) {
      this.__updateItems();
    }
  }

  protected create(): void {
    const webMap = this.webMap;
    if (webMap) {
      webMap.onLoad().then(() => {
        this.destroy();
        const __updateItems = debounce(async () => {
          const items = await this._updateItems();
          this.items = items;
        });
        this.__updateItems = __updateItems;
        this.updateItems();
        webMap.emitter.on('layer:add', __updateItems);
        webMap.emitter.on('layer:remove', __updateItems);
        webMap.emitter.on('layer:toggle', __updateItems);
      });
    }
  }

  protected destroy(): void {
    if (this.__updateItems && this.webMap) {
      this.webMap.emitter.removeListener('layer:add', this.__updateItems);
      this.webMap.emitter.removeListener('layer:remove', this.__updateItems);
      this.webMap.emitter.removeListener('layer:toggle', this.__updateItems);
    }
  }

  protected async _updateItems(): Promise<VueSelectItem[]> {
    const webMap = this.webMap;
    const items: VueSelectItem[] = [];
    if (webMap) {
      await webMap.onLoad();
      const baseLayers: MainLayerAdapter[] = webMap.getBaseLayers();

      if (this.allowEmpty) {
        items.push({
          text: this.emptyLayerText,
          value: emptyValue,
        });
      }

      baseLayers.forEach((baselayer) => {
        items.push({
          value: baselayer.id || '',
          text: baselayer.options.name || baselayer.id || '',
        });
        if (baselayer.id && webMap.isLayerVisible(baselayer)) {
          this.active = baselayer.id;
        }
      });
      this._layers = baseLayers;
    }
    return items;
  }
}
