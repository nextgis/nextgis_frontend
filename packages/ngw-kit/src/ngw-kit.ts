import NgwConnector from '@nextgis/ngw-connector';
import { WebMap, StarterKit } from '@nextgis/webmap';

export interface NgwLayerOptions {
  id: number;
  adapter?: 'IMAGE' | 'TILE';
}

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export interface NgwKitOptions {
  baseUrl?: string;
  pixelRadius?: number;
  resourceId?: number;
  auth?: {
    login: string;
    password: string;
  };
}

interface RequestOptions {
  srs: number;
  geom: any;
  layers: string[];
}

export class NgwKit implements StarterKit {

  static updateWmsParams = (params, resourceId) => {
    const { bbox, width, height } = params;
    return {
      resource: resourceId,
      extent: bbox,
      size: width + ',' + height,
      timestamp: Date.now(),
    };
  }

  static addNgwLayer(options: NgwLayerOptions, webMap: WebMap, baseUrl) {
    const adapter = options.adapter || 'IMAGE';
    if (adapter === 'IMAGE' || adapter === 'TILE') {
      let url = baseUrl;
      let addLayerPromise;
      const isImageAllowed = webMap.map.layerAdapters ? webMap.map.layerAdapters.IMAGE : true;
      if (adapter === 'IMAGE' && isImageAllowed) {
        url += '/api/component/render/image';
        addLayerPromise = webMap.map.addLayer(adapter, {
          url,
          id: String(options.id),
          resourceId: options.id,
          updateWmsParams: (params) => NgwKit.updateWmsParams(params, options.id)
        });
      } else if (adapter === 'TILE') {
        url += '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
        addLayerPromise = webMap.map.addLayer(adapter, { url, id: String(options.id) });
      }
      return addLayerPromise;
    } else {
      throw new Error(adapter + ' not supported yet. Only TILE');
    }
  }

  options: NgwKitOptions = {};

  url: string;
  resourceId: number;
  connector: NgwConnector;

  // Radius for searching objects in pixels
  pixelRadius = 10; // webmapSettings.identify_radius,

  constructor(options?: NgwKitOptions) {
    this.options = { ...this.options, ...options };
    if (this.options.pixelRadius) {
      this.pixelRadius = options.pixelRadius;
    }
    this.url = this.options.baseUrl;
    this.resourceId = options.resourceId;
    this.connector = new NgwConnector({ baseUrl: this.url, auth: this.options.auth });
  }

  getSettings() {
    return new Promise((resolve) => {
      this.connector.request('resource.item', { id: this.resourceId }).then((data) => {
        const webmap = data.webmap;
        if (webmap) {
          this._updateItemsParams(webmap.root_item);
          resolve(data.webmap);
        }
      });
    });
  }

  onMapClick(ev, webMap: WebMap) {
    // this.sendIdentifyRequest(ev, webMap);
  }

  // options is temporal to set list of layers id, because layers id is not item parameter now
  sendIdentifyRequest(ev, webMap: WebMap, options: { layers?: string[] } = {}) {

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
      return this.connector.post('feature_layer.identify', { data }).then((resp) => {
        webMap.emitter.emit('identify', { ev, data: resp });
        return resp;
      });
    }
  }

  private _updateItemsParams(item) {
    if (item) {
      if (item.children) {
        item.children.forEach((x) => this._updateItemsParams(x));
      } else if (item.item_type === 'layer' && item.layer_adapter === 'image') {
        const url = fixUrlStr(this.url + '/api/component/render/image');
        item.url = url;
        item.resourceId = item.layer_style_id;
        item.updateWmsParams = (params) => NgwKit.updateWmsParams(params, item.resourceId);
      }
    }
  }
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
