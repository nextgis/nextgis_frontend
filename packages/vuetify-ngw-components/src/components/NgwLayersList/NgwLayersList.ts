import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import NgwMap, { LayerAdapter } from '@nextgis/ngw-map';
import {
  ResourceAdapter,
  WebMapLayerAdapter,
  WebMapLayerItem
} from '@nextgis/ngw-kit';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview } from 'vuetify/lib';
import { arrayCompare, debounce } from '@nextgis/utils';

interface VueTreeItem {
  id: string;
  name: string;
  children?: VueTreeItem[];
}

@Component
export class NgwLayersList extends Vue {
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;
  @Prop({ type: Array }) include!: Array<ResourceAdapter | string>;
  @Prop({ type: Boolean, default: false }) hideWebmapRoot!: boolean;
  @Prop({ type: Boolean, default: false }) notOnlyNgwLayer!: boolean;
  @Prop({ type: Function }) showLayer!: (layer: WebMapLayerItem) => boolean;
  @Prop({ type: Function }) showResourceAdapter!: (
    adapter: LayerAdapter | ResourceAdapter
  ) => boolean;

  items: VueTreeItem[] = [];

  selection: string[] = [];

  private _layers: Array<LayerAdapter | ResourceAdapter> = [];
  private __updateItems?: () => Promise<void>;
  private __onNgwMapLoad?: Promise<NgwMap>;

  @Watch('selection')
  setVisibleLayers(selection: string[], old: string[]) {
    const isSame = arrayCompare(selection, old);
    if (!isSame) {
      this._layers.forEach(x => {
        if (x.layer && x.layer.properties) {
          const layer = x.layer as WebMapLayerItem;
          if (this.hideWebmapRoot && layer.item.item_type === 'root') {
            layer.properties.set('visibility', true);
          }
          const desc = layer.tree.getDescendants() as WebMapLayerItem[];
          desc.forEach(d => {
            const id = this._getLayerId(d);
            if (id) {
              d.properties.set('visibility', selection.indexOf(id) !== -1);
            }
          });
        }
        if (x.id) {
          const id = this._getLayerId(x);
          this.ngwMap.toggleLayer(x, selection.indexOf(id) !== -1);
        }
      });
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
        value: this.selection,
        'selection-type': 'independent'
      },
      on: {
        input: (event: any) => {
          this.selection = event;
        }
      },
      attrs: { items: this.items, selectable: true },
      scopedSlots: {
        label: props => {
          const name = props.item.name;
          return h('span', {
            domProps: {
              innerHTML: name,
              title: name
            }
          });
        }
      }
      // domProps: { id: this.id }
    };
    return h(VTreeview, data, this.$slots.default);
  }

  @Watch('include')
  async updateItems() {
    if (this.__updateItems) {
      this.__updateItems();
    }
  }

  private create() {
    this.__onNgwMapLoad = this.ngwMap.onLoad();
    setTimeout(() => {
      if (this.__onNgwMapLoad) {
        this.__onNgwMapLoad.then(() => {
          this.destroy();
          this.updateItems();
          const __updateItems = debounce(() => this._updateItems());
          this.__updateItems = __updateItems;

          this.ngwMap.emitter.on('layer:add', __updateItems);
          this.ngwMap.emitter.on('layer:remove', __updateItems);
        });
      }
    });
  }

  private destroy() {
    if (this.__updateItems) {
      this.ngwMap.emitter.off('layer:add', this.__updateItems);
      this.ngwMap.emitter.off('layer:remove', this.__updateItems);
    }
  }

  private async _updateItems() {
    this.selection = [];
    this._layers = [];
    let layersList: LayerAdapter[] | undefined;
    if (this.notOnlyNgwLayer) {
      await this.ngwMap.onLoad();
      const layers = this.ngwMap.allLayers();
      layersList = Object.keys(layers).map(x => layers[x]);
    } else {
      const ngwLayers = await this.ngwMap.getNgwLayers();
      layersList = Object.keys(ngwLayers).map(x => ngwLayers[x].layer);
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
        .forEach(x => {
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
      children: []
    };
    if (this.include) {
      const isInclude = this.include.find(x => {
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
    const webMap = 'item' in layer && layer.item && layer.item.webmap;
    const webMapLayer = layer as WebMapLayerAdapter;
    if (webMap && webMapLayer.layer) {
      const tree = webMapLayer.layer.tree;
      const children = tree.getChildren() as WebMapLayerItem[];
      item.children = this._createWebMapTree(children).reverse();
      const webMapLayerVisible = webMapLayer.layer.properties.get('visibility');
      visible = webMapLayerVisible ?? true;
    } else {
      visible = this.ngwMap.isLayerVisible(layer);
    }

    this._layers.push(layer);
    if (
      item.children &&
      this.hideWebmapRoot &&
      webMapLayer.layer?.item.item_type === 'root'
    ) {
      item.children.reverse().forEach(x => this.items.push(x));
      webMapLayer.layer && webMapLayer.layer.properties.set('visibility', true);
    } else {
      if (visible) {
        this.selection.push(item.id);
      }
      this.items.push(item);
    }
  }

  private _createWebMapTree(items: WebMapLayerItem[]) {
    const treeItems: VueTreeItem[] = [];

    items.forEach(x => {
      const id = this._getLayerId(x);

      if (this.showLayer) {
        const checked = this.showLayer(x);
        if (!checked) return;
      }

      const item: VueTreeItem = {
        id,
        name: x.item.display_name || id
      };
      const children = x.tree.getChildren<WebMapLayerItem>();
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
    layer: LayerAdapter | ResourceAdapter | WebMapLayerItem
  ): string {
    const webMap = layer as WebMapLayerItem;
    const webMapTree = webMap.tree;
    if (webMapTree) {
      const parents = webMap.tree
        .getParents<WebMapLayerItem>()
        .map(x => x.item.display_name);
      const id = [...parents, webMap.item.display_name].join('-');
      return id;
    } else {
      return String(layer.id);
    }
  }
}
