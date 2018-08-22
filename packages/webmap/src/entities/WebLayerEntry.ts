import { Entry, EntryOptions } from './entry/Entry';
import { TreeGroup, TreeLayer } from '../interfaces/AppSettings';
import { MapAdapter } from '../interfaces/MapAdapter';
import { LayerAdapters } from '../interfaces/LayerAdapter';

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
              entry.map.showLayer(entry.id);
            } else {
              entry.map.hideLayer(entry.id);
            }
            entry.item.layer_enabled = value;
          }
        },
      },
    ],
  };

  map: MapAdapter<any>;

  item: TreeGroup | TreeLayer;

  constructor(map: MapAdapter<any>,
              item: TreeGroup | TreeLayer, options?: EntryOptions, parent?: WebLayerEntry) {
    super(Object.assign({}, WebLayerEntry.options, options));
    this.map = map;
    this.item = item;
    if (parent) {
      this.tree.setParent(parent);
    }
    this.initProperties();
    this.initItem(item);
  }

  initItem(item: TreeGroup | TreeLayer) {
    let newLayer = item._layer;
    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        item.children.forEach((x) => {
          const children = new WebLayerEntry(this.map, x, this.options, this);
          this.tree.addChildren(children);
        });
      }
    } else if (item.item_type === 'layer') {
      const adapter = item.layer_adapter.toUpperCase() as keyof LayerAdapters;
      newLayer = this.map.addLayer(adapter, Object.assign({
        id: this.id,
      }, item));
    }
    if (newLayer) {
      item._layer = newLayer;
      if (item.item_type === 'layer' && item.layer_enabled) {
        this.properties.get('visibility').set(true);
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
