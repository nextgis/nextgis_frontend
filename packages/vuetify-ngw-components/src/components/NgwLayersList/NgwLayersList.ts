import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { NgwMap, LayerAdapter, WebMap } from '@nextgis/ngw-map';
import {
  ResourceAdapter,
  NgwWebmapLayerAdapter,
  NgwWebmapItem,
} from '@nextgis/ngw-kit';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview } from 'vuetify/lib';
import { arrayCompare, debounce } from '@nextgis/utils';

export interface VueTreeItem {
  id: string;
  name: string;
  layer?: string;
  children?: VueTreeItem[];
}

@Component
export class NgwLayersList extends Vue {
  @Prop({ type: Number }) webMapId!: number;
  @Prop({ type: Array }) include!: Array<ResourceAdapter | string>;
  @Prop({ type: Boolean, default: false }) hideWebmapRoot!: boolean;
  @Prop({ type: Boolean, default: false }) notOnlyNgwLayer!: boolean;
  @Prop({ type: Function }) showLayer!: (layer: NgwWebmapItem) => boolean;
  @Prop({ type: Function }) showResourceAdapter!: (
    adapter: LayerAdapter | ResourceAdapter
  ) => boolean;
  /** @deprecated for backward compatibility */
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;

  items: VueTreeItem[] = [];

  selection: string[] = [];

  private _layers: Array<LayerAdapter | ResourceAdapter> = [];
  private __updateItems?: () => Promise<void>;

  get webMap(): WebMap | undefined {
    return this.ngwMap || WebMap.get(this.webMapId);
  }

  @Watch('selection')
  setVisibleLayers(selection: string[], old: string[]): void {
    const isSame = arrayCompare(selection, old);
    if (!isSame) {
      this._layers.forEach((x) => {
        let itemIsNotHideRoot = false;
        // layer properties fpr webmap tree items detect
        // check visibility for all webmap tree layer
        if (x.layer && x.layer.properties) {
          const layer = x.layer as NgwWebmapItem;
          if (this.hideWebmapRoot && layer.item.item_type === 'root') {
            itemIsNotHideRoot = true;
            layer.properties.set('visibility', true);
          }
          const desc = layer.tree.getDescendants() as NgwWebmapItem[];
          desc.forEach((d) => {
            const id = this._getLayerId(d);
            if (id) {
              const isVisible = selection.indexOf(id) !== -1;
              d.properties.set('visibility', isVisible);
            }
          });
        }
        if (x.id && !itemIsNotHideRoot && this.webMap) {
          const id = this._getLayerId(x);
          this.webMap.toggleLayer(x, selection.indexOf(id) !== -1);
        }
      });
    }
  }

  @Watch('ngwMap')
  updateNgwMap(): void {
    this.destroy();
    this.create();
  }

  @Watch('include')
  async updateItems(): Promise<void> {
    if (this.__updateItems) {
      this.__updateItems();
    }
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
        value: this.selection,
        'selection-type': 'independent',
      },
      on: {
        input: (event: any) => {
          this.selection = event;
        },
      },
      attrs: {
        ...this.$attrs,
        items: this.items,
        selectable: true,
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
      // domProps: { id: this.id }
    };
    return h(VTreeview, data, this.$slots.default);
  }

  private create() {
    if (this.webMap) {
      this.webMap.onLoad().then(() => {
        this.destroy();
        const __updateItems = debounce(() => this._updateItems());
        this.__updateItems = __updateItems;
        this.updateItems();
        if (this.webMap) {
          this.webMap.emitter.on('layer:add', __updateItems);
          this.webMap.emitter.on('layer:remove', __updateItems);
        }
      });
    }
  }

  private destroy() {
    if (this.webMap && this.__updateItems) {
      this.webMap.emitter.removeListener('layer:add', this.__updateItems);
      this.webMap.emitter.removeListener('layer:remove', this.__updateItems);
    }
  }

  private async _updateItems() {
    this.selection = [];
    this._layers = [];
    let layersList: LayerAdapter[] | undefined;
    if (this.webMap) {
      if (this.notOnlyNgwLayer) {
        await this.webMap.onLoad();
        const layers = this.webMap.allLayers();
        layersList = Object.keys(layers).map((x) => layers[x]);
      } else if ('getNgwLayers' in this.webMap) {
        const ngwLayers = await (this.webMap as NgwMap).getNgwLayers();
        layersList = Object.keys(ngwLayers).map((x) => ngwLayers[x].layer);
      }
    }
    this.items = [];
    if (layersList) {
      layersList
        .sort((a, b) => {
          const aOrder = (a.options && a.options.order) || 0;
          const bOrder = (b.options && b.options.order) || 0;
          return aOrder - bOrder;
        })
        .reverse()
        .forEach((x) => {
          this._createTreeItem(x);
        });
    }
  }

  private _createTreeItem(layer: LayerAdapter | ResourceAdapter) {
    if (this.showResourceAdapter) {
      const adapterEnabled = this.showResourceAdapter(layer);
      if (!adapterEnabled) return;
    }

    const name =
      layer.options.name ||
      ('item' in layer &&
        layer.item &&
        layer.item.resource &&
        layer.item.resource.display_name) ||
      String(layer.id);
    const item: VueTreeItem = {
      id: layer.id || '',
      name,
      layer: layer.id || '',
      children: [],
    };
    if (this.include) {
      const isInclude = this.include.find((x) => {
        if (typeof x === 'string') {
          return item.id === x;
        } else {
          return layer === x;
        }
      });
      if (!isInclude) {
        return;
      }
    }
    let visible = false;

    const webMapLayer = layer as NgwWebmapLayerAdapter;
    if (webMapLayer.layer && webMapLayer.layer.tree) {
      const tree = webMapLayer.layer.tree;
      const children = tree.getChildren() as NgwWebmapItem[];
      item.children = this._createWebMapTree(children).reverse();
      const webMapLayerVisible = webMapLayer.layer.properties.get('visibility');
      visible = webMapLayerVisible ?? true;
    } else if (this.webMap) {
      visible = this.webMap.isLayerVisible(layer);
    }

    this._layers.push(layer);
    if (
      item.children &&
      this.hideWebmapRoot &&
      webMapLayer.layer &&
      webMapLayer.layer.item &&
      webMapLayer.layer.item.item_type === 'root'
    ) {
      item.children.reverse().forEach((x) => this.items.push(x));
      webMapLayer.layer && webMapLayer.layer.properties.set('visibility', true);
    } else {
      if (visible) {
        this.selection.push(item.id);
      }
      this.items.push(item);
    }
  }

  private _createWebMapTree(items: NgwWebmapItem[]) {
    const treeItems: VueTreeItem[] = [];

    items.forEach((x) => {
      const id = this._getLayerId(x);

      if (this.showLayer) {
        const checked = this.showLayer(x);
        if (!checked) return;
      }

      const item: VueTreeItem = {
        id,
        name: x.item.display_name || id,
      };
      if (x.layer) {
        item.layer = x.layer.id;
      }
      const children = x.tree.getChildren<NgwWebmapItem>();
      if (children && children.length) {
        item.children = this._createWebMapTree(children);
      }
      const visible = x.properties.get('visibility');
      if (visible) {
        this.selection.push(id);
      }
      treeItems.push(item);
    });

    return treeItems;
  }

  private _getLayerId(
    layer: LayerAdapter | ResourceAdapter | NgwWebmapItem
  ): string {
    const webMap = layer as NgwWebmapItem;
    const webMapTree = webMap.tree;
    if (webMapTree) {
      const parents = webMap.tree
        .getParents<NgwWebmapItem>()
        .map((x) => x.item.display_name);
      // @ts-ignore
      const itemId = webMap.item.id;
      const id = [...parents, webMap.item.display_name, itemId].join('-');
      return id;
    } else {
      return String(layer.id);
    }
  }
}
