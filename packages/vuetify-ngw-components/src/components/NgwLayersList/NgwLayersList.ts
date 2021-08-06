import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { NgwMap, LayerAdapter, WebMap } from '@nextgis/ngw-map';
import {
  ResourceAdapter,
  NgwWebmapLayerAdapter,
  NgwWebmapItem,
  TreeGroup,
  TreeLayer,
} from '@nextgis/ngw-kit';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview, VBtn, VIcon } from 'vuetify/lib';
import { debounce } from '@nextgis/utils';

export interface VueTreeItem {
  id: string;
  name: string;
  layer?: string;
  children?: VueTreeItem[];
  removable?: boolean;
}

@Component
export class NgwLayersList extends Vue {
  @Prop({ type: Number }) webMapId!: number;
  @Prop({ type: Array }) include!: Array<ResourceAdapter | string>;
  @Prop({ type: Boolean, default: false }) hideWebmapRoot!: boolean;
  @Prop({ type: Boolean, default: false }) notOnlyNgwLayer!: boolean;
  @Prop({ type: Function }) showLayer!: (layer: NgwWebmapItem) => boolean;
  @Prop({ type: String, default: 'mdi-cancel' }) removeLayerIcon!: string;
  @Prop({ type: String, default: 'independent' }) selectionType!:
    | 'independent'
    | 'leaf';
  @Prop({ type: Function }) showResourceAdapter!: (
    adapter: LayerAdapter | ResourceAdapter,
  ) => boolean;
  /** @deprecated for backward compatibility */
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;

  items: VueTreeItem[] = [];

  selection: string[] = [];
  open: string[] = [];

  private _selectionWatcher?: () => void;
  private _layers: Array<LayerAdapter | ResourceAdapter> = [];
  private __updateItems?: () => Promise<void>;
  private __onLayerAdd?: (l: LayerAdapter) => void;

  get webMap(): WebMap | undefined {
    return this.ngwMap || WebMap.get(this.webMapId);
  }

  get independent(): boolean {
    return this.selectionType === 'independent';
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

  setVisibleLayers(selection: string[], old: string[]): void {
    const difference = selection
      .filter((x) => !old.includes(x))
      .concat(old.filter((x) => !selection.includes(x)));

    // const isSame = arrayCompare(selection, old);
    if (difference.length) {
      this._layers.forEach((x) => {
        let itemIsNotHideRoot = false;
        // layer properties fpr webmap tree items detect
        // check visibility for all webmap tree layer
        if (x.layer && x.layer.properties) {
          const layer = x.layer as NgwWebmapItem;
          if (
            (!this.independent && this.itemIsGroup(layer.item)) ||
            (this.hideWebmapRoot && layer.item.item_type === 'root')
          ) {
            itemIsNotHideRoot = true;
            layer.properties.set('visibility', true);
          }

          const desc = layer.tree.getDescendants() as NgwWebmapItem[];
          desc.forEach((d) => {
            const id = this._getLayerId(d);
            if (difference.indexOf(id) !== -1) {
              const isVisible =
                !this.independent && this.itemIsGroup(d.item)
                  ? true
                  : selection.indexOf(id) !== -1;
              d.properties.set('visibility', isVisible);
            }
          });
        }
        if (x.id && !itemIsNotHideRoot && this.webMap) {
          const id = this._getLayerId(x);
          if (difference.indexOf(id) !== -1) {
            this.webMap.toggleLayer(x, selection.indexOf(id) !== -1);
          }
        }
      });
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
        'selection-type': this.selectionType,
      },
      on: {
        input: (event: any) => {
          this.selection = event;
        },
      },
      attrs: {
        ...this.$attrs,
        items: this.items,
        open: this.open,
        selectable: true,
      },
      scopedSlots: {
        label: (props) => {
          const name = props.item.name;
          return h('span', {
            domProps: {
              innerHTML: name,
              title: name,
            },
          });
        },
        append: (props) => {
          const item = props.item as VueTreeItem;
          if (item.removable) {
            return this._appendRemoveBtn(h, item);
          }
          return null;
        },
        ...this.$scopedSlots,
      },
    };
    return h(VTreeview, data, this.$slots.default);
  }

  private itemIsGroup(item: TreeGroup | TreeLayer) {
    return item.item_type === 'group' || item.item_type === 'root';
  }

  private create() {
    if (this.webMap) {
      this.webMap.onLoad().then(() => {
        this.destroy();
        this.__updateItems = debounce(() => this._updateItems(), 100);
        this.__onLayerAdd = (l: LayerAdapter) => this._onLayerAdd(l);
        this.updateItems().then(() => {
          this._startListeners();
        });
      });
    }
  }

  private destroy() {
    this._stopUpdateItemListeners();
  }

  private _appendRemoveBtn(h: CreateElement, item: VueTreeItem): VNode {
    const data: VNodeData = {
      props: {
        icon: true,
        'x-small': true,
      },
      on: {
        click: () => {
          const webMap = this.webMap;
          if (webMap && item.layer) {
            webMap.removeLayer(item.layer);
          }
        },
      },
    };
    return h(VBtn, data, [
      h(VIcon, {
        domProps: {
          textContent: this.removeLayerIcon,
        },
      }),
    ]);
  }

  private _onLayerAdd(l: LayerAdapter) {
    const id = l.options.id;
    const exist =
      this._layers &&
      this._layers.find((x) => {
        if (x.id === id) {
          return true;
        }
        const layer = x.layer as NgwWebmapItem;
        const tree = layer.tree;
        const existInTree = tree && tree.some((y) => String(y.id) === id);
        if (existInTree) {
          return true;
        }
        return false;
      });
    if (!exist && this.__updateItems) {
      this.__updateItems();
    }
  }

  private async _updateItems() {
    this.selection = [];
    this.open = [];
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
      [...layersList]
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
      removable: layer.options.props && layer.options.props.removable,
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
      item.children = this._createWebMapTree(children);
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
      item.children.forEach((x) => this.items.push(x));
      webMapLayer.layer && webMapLayer.layer.properties.set('visibility', true);
    } else {
      if (visible && this.independent) {
        this.selection.push(item.id);
      }
      this.items.push(item);
    }
  }

  private _createWebMapTree(items: NgwWebmapItem[]) {
    const treeItems: VueTreeItem[] = [];

    [...items].reverse().forEach((x) => {
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
      } else {
        x.emitter.once('init', () => {
          if (x.layer) {
            item.layer = x.layer.id;
          }
        });
      }
      let visible = x.properties.get('visibility');
      if (x.item.item_type === 'group') {
        const children = x.tree.getChildren<NgwWebmapItem>();
        if (children && children.length) {
          item.children = this._createWebMapTree(children);
        }
        if (x.item.group_expanded) {
          this.open.push(id);
        }
        if (!this.independent) {
          visible = false;
        }
      }
      if (visible) {
        this.selection.push(id);
      }
      treeItems.push(item);
    });

    return treeItems;
  }

  private _startListeners() {
    this._startSelectionWatch();
    this._startUpdateItemListeners();
  }

  private _startUpdateItemListeners() {
    this._stopUpdateItemListeners();
    const __updateItems = this.__updateItems;
    if (this.webMap) {
      if (__updateItems) {
        // this.webMap.emitter.on('layer:pretoggle', __updateItems);
        this.webMap.emitter.on('layer:preremove', __updateItems);
      }
      if (this.__onLayerAdd) {
        this.webMap.emitter.on('layer:add', this.__onLayerAdd);
      }
    }
  }

  private _stopUpdateItemListeners() {
    if (this.webMap) {
      if (this.__updateItems) {
        // this.webMap.emitter.removeListener(
        //   'layer:pretoggle',
        //   this.__updateItems
        // );
        this.webMap.emitter.removeListener(
          'layer:preremove',
          this.__updateItems,
        );
      }
      if (this.__onLayerAdd) {
        this.webMap.emitter.removeListener('layer:add', this.__onLayerAdd);
      }
    }
  }

  private _startSelectionWatch() {
    this._stopSelectionWatch();
    this._selectionWatcher = this.$watch('selection', this.setVisibleLayers);
  }

  private _stopSelectionWatch() {
    if (this._selectionWatcher) {
      this._selectionWatcher();
      this._selectionWatcher = undefined;
    }
  }

  private _getLayerId(
    layer: LayerAdapter | ResourceAdapter | NgwWebmapItem,
  ): string {
    const webMap = layer as NgwWebmapItem;
    const webMapTree = webMap.tree;
    if (webMapTree) {
      const parents = webMap.tree
        .getParents<NgwWebmapItem>()
        .map((x) => x.item.display_name);
      // @ts-ignore
      const itemId = webMap.item.id !== undefined ? webMap.item.id : webMap.id;
      const id = [...parents, webMap.item.display_name, itemId].join('-');
      return id;
    } else {
      return String(layer.id);
    }
  }
}
