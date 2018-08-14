import { Entry, EntryOptions } from './entry/Entry';
import { TreeGroup, TreeLayer } from './../interfaces/AppSettings';
import { fixUrlStr } from '../utils/lang';
import { MapAdapter } from '../interfaces/MapAdapter';
import { NgwConfig } from '../interfaces/NgwConfig';

interface WebLayerEntryOptions extends EntryOptions {
  ngwConfig?: NgwConfig;
}

export class WebLayerEntry extends Entry<WebLayerEntryOptions> {
  static options: WebLayerEntryOptions = {
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
              entry.map.hidelayer(entry.id);
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
              item: TreeGroup | TreeLayer, options: WebLayerEntryOptions, parent?: WebLayerEntry) {
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
      const url = fixUrlStr(this.options.ngwConfig.applicationUrl + '/api/component/render/image');
      newLayer = this.map.addLayer(this.id, 'image', {
        url,
        styleId: item.layer_style_id,
        transparency: item.layer_transparency,
        // visibility: item.layer_enabled,
        minResolution: item.layer_min_scale_denom,
        maxResolution: item.layer_max_scale_denom,
      });
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
