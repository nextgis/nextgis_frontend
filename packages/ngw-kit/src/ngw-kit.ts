import { NgwConnector } from '@nextgis/ngw-connector';
import { WebMap, StarterKit } from '@nextgis/webmap';

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

interface RequestOptions {
  srs: number;
  geom: any;
  layers: string[];
}

export class NgwKit implements StarterKit {

  url: string;
  resourceId: number;
  connector: NgwConnector;

  // Radius for searching objects in pixels
  pixelRadius: 10; // webmapSettings.identify_radius,

  constructor(options?) {
    if (options.pixelRadius) {
      this.pixelRadius = options.pixelRadius;
    }
    this.url = options.baseUrl;
    this.resourceId = options.resourceId;
    this.connector = new NgwConnector({ baseUrl: this.url });
  }

  getSettings() {
    return new Promise((resolve) => {
      this.connector.request('resource.item', (data) => {
        const webmap = data.webmap;
        if (webmap) {

          this._updateItemsUrl(webmap.root_item);

          resolve(data.webmap);
        }
      }, { id: this.resourceId });
    });
  }

  onMapClick(ev, webMap: WebMap) {
    // this.sendIdentifyRequest(ev, webMap);
  }

  // options is temporal to set list of layers id, because layers id is not item parameter now
  sendIdentifyRequest(ev, webMap: WebMap, options: { layers?: string[] } = {}) {
    return new Promise((resolve, reject) => {
      if (webMap.map.requestGeomString) {
        webMap.emitter.emit('start-identify', { ev });
        const geom = webMap.map.requestGeomString(ev.pixel, this.pixelRadius);
        let layers: string[] = options.layers;
        if (!layers) {
          // TODO: layer_style_id - 1 is hardcode to get layers id for geonote.nextgis.com instant
          layers = webMap.layers.tree.getDescendants().filter((x) => {
            return x.item.item_type === 'layer' && x.properties.get('visibility');
          }).map((x) => String(Number(x.item.layer_style_id) - 1));
        }
        const data: RequestOptions = {
          geom,
          srs: 3857,
          layers,
        };
        this.connector.post('feature_layer.identify', (resp) => {
          webMap.emitter.emit('identify', { ev, data: resp });
          resolve(resp);
        }, { data }, reject);
      }
    });
  }

  private _updateItemsUrl(item) {
    if (item) {
      if (item.children) {
        item.children.forEach((x) => this._updateItemsUrl(x));
      } else if (item.item_type === 'layer' && item.layer_adapter === 'image') {
        const url = fixUrlStr(this.url + '/api/component/render/image');
        item.url = url;
      }
    }
  }
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
