import { Entry, EntryOptions } from './components/entry/Entry';
import { TreeGroup, TreeLayer } from './interfaces/AppSettings';
import { LayerAdapters } from './interfaces/LayerAdapter';
import WebMap from '.';

export class WebLayerEntry extends Entry<EntryOptions> {
  static options: EntryOptions = {
    properties: [
      {
        type: 'boolean',
        name: 'visibility',
        getProperty() {
          const entry: WebLayerEntry = this.entry;
          if (entry.item.item_type === 'group') {
            return true;
          } else if (entry.item.item_type === 'layer') {
            return entry.item.layer_enabled;
          } else if (entry.item.item_type === 'root') {
            return true;
          }
          return false;
        },
        onSet(value: boolean) {
          const entry: WebLayerEntry = this.entry;
          if (entry.item.item_type === 'layer') {
            if (value) {
              entry.webMap.showLayer(entry.id);
            } else {
              entry.webMap.hideLayer(entry.id);
            }
            entry.item.layer_enabled = value;
          }
        },
      },
    ],
  };

  item: TreeGroup | TreeLayer;

  constructor(public webMap: WebMap,
              item: TreeGroup | TreeLayer, options?: EntryOptions, parent?: WebLayerEntry) {
    super(Object.assign({}, WebLayerEntry.options, options));

    this.item = item;
    if (parent) {
      this.tree.setParent(parent);
    }
    this.initProperties();
    this.initItem(item);
  }

  async initItem(item: TreeGroup | TreeLayer) {
    let newLayer = item._layer;
    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        item.children.reverse().forEach((x) => {
          const children = new WebLayerEntry(this.webMap, x, this.options, this);
          this.tree.addChildren(children);
        });
      }
    } else if (item.item_type === 'layer') {
      const adapter = item.layer_adapter.toUpperCase() as keyof LayerAdapters;
      item.id = Number(this.id);
      const options: any = {...item, ...{id: item.id}};
      newLayer = await this.webMap.addLayer(adapter, options);
    }
    if (newLayer) {
      item._layer = newLayer;
      if (item.item_type === 'layer' && item.layer_enabled) {
        this.properties.property('visibility').set(true);
      }
    } else {
      // this.properties.get('visibility').set(true);
    }
  }

  // region layer control
  fit(): void {
    if (this.item.item_type === 'layer') {
      console.log(this.item);
    }
  }
  //
}
