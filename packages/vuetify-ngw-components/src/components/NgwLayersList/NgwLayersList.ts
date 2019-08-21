import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import NgwMap, { NgwLayersMem } from '@nextgis/ngw-map';
import { ResourceAdapter, WebMapLayerAdapter, WebMapLayerItem } from '@nextgis/ngw-kit';
import { TreeGroup, TreeLayer } from '@nextgis/ngw-connector';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview } from 'vuetify/lib';
import { layerGroup } from 'leaflet';

interface VueTreeItem {
  id: string;
  name: string;
  children?: VueTreeItem[];
}

@Component
export class NgwLayersList extends Vue {
  @Prop({ type: NgwMap }) ngwMap!: NgwMap;
  @Prop({ type: Array }) include!: Array<ResourceAdapter | string>;

  items: VueTreeItem[] = [];

  selection: string[] = [];

  private _layers: ResourceAdapter[] = [];
  private __updateItems?: () => Promise<void>;

  @Watch('selection')
  setVisibleLayers() {
    this._layers.forEach(x => {
      if (x.layer && x.layer.properties) {
        const layer = x.layer as WebMapLayerItem;
        const desc = layer.tree.getDescendants() as WebMapLayerItem[];
        desc.forEach(d => {
          const id = d.layer && d.layer.id;
          if (id) {
            d.properties.set('visibility', this.selection.indexOf(id) !== -1);
          }
        });
      }
      if (x.id) {
        this.ngwMap.toggleLayer(x, this.selection.indexOf(x.id) !== -1);
      }
    });
  }

  mounted() {
    const __updateItems = () => this.updateItems();
    this.__updateItems = __updateItems;
    this.ngwMap.onLoad().then(() => {
      this.updateItems();

      this.ngwMap.emitter.on('layer:add', __updateItems);
      this.ngwMap.emitter.on('layer:remove', __updateItems);
    });
  }

  beforeDestroy() {
    if (this.__updateItems) {
      this.ngwMap.emitter.off('layer:add', this.__updateItems);
      this.ngwMap.emitter.off('layer:remove', this.__updateItems);
    }
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
      attrs: { items: this.items, selectable: true }
      // domProps: { id: this.id }
    };
    return h(VTreeview, data, this.$slots.default);
  }

  @Watch('include')
  private async updateItems() {
    this.selection = [];
    this._layers = [];
    const ngwLayers = await this.ngwMap.getNgwLayers();
    const ngwLayersList = Object.keys(ngwLayers).map(x => ngwLayers[x]);
    this.items = [];
    ngwLayersList
      .sort((a, b) => {
        const aOrder = (a.layer.options && a.layer.options.order) || 0;
        const bOrder = (b.layer.options && b.layer.options.order) || 0;
        return aOrder - bOrder;
      })
      .forEach(x => {
        this._createTreeItem(x);
      });
  }

  private _createTreeItem(layerMem: NgwLayersMem) {
    const layer: ResourceAdapter = layerMem.layer;
    const name = (layer.item && layer.item.resource.display_name) || String(layer.id);
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
    const webMap = layer.item && layer.item.webmap;
    if (webMap) {
      const webMapLayer = layer as WebMapLayerAdapter;
      item.children = this._createWebMapTree(webMapLayer.getDependLayers());
      visible = true;
    } else {
      visible = this.ngwMap.isLayerVisible(layer);
    }
    if (visible) {
      this.selection.push(item.id);
    }
    this._layers.push(layer);
    this.items.push(item);
  }

  private _createWebMapTree(items: WebMapLayerItem[]) {
    return items
      .filter(x => x.layer && x.layer.id)
      .map(x => {
        const _id = x.layer && x.layer.id;
        const id = String(_id);
        const item: VueTreeItem = {
          id,
          name: x.item.display_name || id
        };
        const children = x.tree.getChildren<WebMapLayerItem>();
        if (children) {
          item.children = this._createWebMapTree(children);
        }
        const visible = x.properties.get('visibility');
        if (visible) {
          this.selection.push(id);
        }
        return item;
      });
  }
}
