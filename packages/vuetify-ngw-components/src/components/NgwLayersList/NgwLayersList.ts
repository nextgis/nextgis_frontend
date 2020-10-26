import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  NgwMap,
  LayerAdapter,
  WebMap,
  MainLayerAdapter,
} from '@nextgis/ngw-map';
import { debounce, DebounceDecorator } from '@nextgis/utils';
import {
  ResourceAdapter,
  NgwWebmapLayerAdapter,
  NgwWebmapItem,
} from '@nextgis/ngw-kit';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview } from 'vuetify/lib';

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
  @Prop({ type: Boolean, default: false }) propagation!: boolean;
  @Prop({ type: Function }) showLayer!: (layer: NgwWebmapItem) => boolean;
  @Prop({ type: Function }) showResourceAdapter!: (
    adapter: LayerAdapter | ResourceAdapter
  ) => boolean;
  /** @deprecated for backward compatibility */
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;

  items: VueTreeItem[] = [];

  selection: string[] = [];
  private tmpSelection: string[] = [];

  private _selectionWatcher?: () => void;
  private _layers: Array<LayerAdapter | ResourceAdapter> = [];
  private __updateItems?: () => Promise<void>;
  private __onLayerAdd?: (l: LayerAdapter) => void;
  private tmpPropagation = false;

  get webMap(): WebMap | undefined {
    return this.ngwMap || WebMap.get(this.webMapId);
  }

  @Watch('ngwMap')
  updateNgwMap(): void {
    this.destroy();
    this.create();
  }

  @Watch('include')
  onInclude(): void {
    this.updateItems();
  }

  @DebounceDecorator()
  setVisibleLayers(selection: string[], old: string[]): void {
    this.tmpPropagation = this.isPropagationNow();
    const propagation = this.tmpPropagation;
    const difference = selection
      .filter((x) => !old.includes(x))
      .concat(old.filter((x) => !selection.includes(x)));

    const setTreeItemVisibility = (d: NgwWebmapItem, id?: string) => {
      id = id !== undefined ? id : this._getLayerId(d);
      if (id && difference.indexOf(id) !== -1) {
        const isGroup =
          d.item.item_type === 'group' || d.item.item_type === 'root';
        const isVisible = selection.indexOf(id) !== -1;
        d.properties.set('visibility', isVisible, {
          propagation: propagation && isGroup,
          bubble: propagation,
        });

        this._updateTreeVisibilityForPropagateItem(d);
      }
    };

    const readyToFinishPromises: Promise<void>[] = [];
    if (difference.length) {
      this._stopUpdateItemListeners();
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
            setTreeItemVisibility(d);
          });
        }
        if (x.id && !itemIsNotHideRoot && this.webMap) {
          const id = this._getLayerId(x);
          if (difference.indexOf(id) !== -1) {
            const isVisible = selection.indexOf(id) !== -1;
            if ('properties' in x.layer) {
              setTreeItemVisibility(x.layer as NgwWebmapItem, id);
            } else {
              readyToFinishPromises.push(
                this.webMap.toggleLayer(x, isVisible)
              );
            }
          }
        }
      });

      if (propagation) {
        readyToFinishPromises.push(this.updateItems());
      }
      Promise.all(readyToFinishPromises).finally(() => {
        this.tmpPropagation = this.isPropagationNow();
        this._startUpdateItemListeners();
      });
    }
  }

  async updateItems(): Promise<void> {
    if (this.__updateItems) {
      await this.__updateItems();
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

  private isPropagationNow() {
    return this.webMap?.keys.pressed('ctrl')
      ? !this.propagation
      : this.propagation;
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
        const existInTree = tree.some((y) => String(y.id) === id);
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
    this._stopSelectionWatch();
    this.tmpSelection = [];
    this._layers = [];
    let layersList: LayerAdapter[] | undefined;
    if (this.webMap) {
      if (this.notOnlyNgwLayer) {
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
        .forEach((x) => {
          this._createTreeItem(x);
        });
    }
    this.selection = this.tmpSelection;
    this._startSelectionWatch();
  }

  private _updateTreeVisibilityForPropagateItem(
    d: NgwWebmapItem | MainLayerAdapter
  ) {
    if (this.tmpPropagation && 'tree' in d) {
      const parents = d.tree.getParents();
      if (this.hideWebmapRoot) {
        parents.pop();
      }
      parents.forEach((p) => {
        const isParentVisible = p.properties.get('visibility');
        const parentProp = p.properties.property('visibility');
        const isParentChildVisible = parentProp.getProperty();
        if (isParentChildVisible !== isParentVisible) {
          p.properties.set('visibility', isParentChildVisible);
        }
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
      item.children = this._createWebMapTree(children);
      const props = webMapLayer.layer.properties;
      const webMapLayerVisible = props.get('visibility');
      if (
        this.tmpPropagation &&
        (webMapLayer.layer.item.item_type === 'group' ||
          webMapLayer.layer.item.item_type === 'root')
      ) {
        const parentProp = props.property('visibility');
        const isGroupVisible = parentProp.getProperty();
        if (isGroupVisible !== webMapLayerVisible) {
          visible = isGroupVisible;
        }
      } else {
        visible = webMapLayerVisible ?? true;
      }
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
      if (visible) {
        this.tmpSelection.push(item.id);
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
      if (x.item.item_type === 'group') {
        const children = x.tree.getChildren<NgwWebmapItem>();
        item.children = this._createWebMapTree(children);
      }
      const visible = x.properties.get('visibility');
      if (visible) {
        this.tmpSelection.push(id);
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
        this.webMap.emitter.on('layer:pretoggle', __updateItems);
        this.webMap.emitter.on('layer:preremove', __updateItems);
      }
      if (this.__onLayerAdd) {
        // this.webMap.emitter.on('layer:preadd', this.__onLayerAdd);
      }
    }
  }

  private _stopUpdateItemListeners() {
    if (this.webMap) {
      if (this.__updateItems) {
        this.webMap.emitter.removeListener(
          'layer:pretoggle',
          this.__updateItems
        );
        this.webMap.emitter.removeListener(
          'layer:preremove',
          this.__updateItems
        );
      }
      if (this.__onLayerAdd) {
        this.webMap.emitter.removeListener('layer:preadd', this.__onLayerAdd);
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
