import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import NgwMap from '@nextgis/ngw-map';
import { ResourceAdapter } from '@nextgis/ngw-kit';
import { TreeGroup, TreeLayer } from '@nextgis/ngw-connector';
import { CreateElement, VNode, VNodeData } from 'vue';
// @ts-ignore
import { VTreeview } from 'vuetify/lib';

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
        value: this.selection
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
        const layer: ResourceAdapter = x.layer;
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
        const webMap = layer.item && layer.item.webmap;
        if (webMap) {
          item.children = this._craeteWebMapTree(webMap.root_item.children);
        }
        if (this.ngwMap.isLayerVisible(layer)) {
          this.selection.push(item.id);
        }
        this._layers.push(layer);
        this.items.push(item);
      });
  }

  private _craeteWebMapTree(items: Array<TreeGroup | TreeLayer>) {
    return items.map(x => {
      const item: VueTreeItem = {
        id: String(x.id),
        name: x.display_name || String(x.id)
      };
      if (x.item_type === 'group' && x.children) {
        item.children = this._craeteWebMapTree(x.children);
      }
      return item;
    });
  }
}
