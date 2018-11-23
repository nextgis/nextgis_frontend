import NgwConnector from '@nextgis/ngw-connector';
import WebMap, { StarterKit } from '@nextgis/webmap';

export interface NgwLayerOptions {
  id: number;
  adapter?: 'IMAGE' | 'TILE' | 'GEOJSON';
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
export default class NgwKit implements StarterKit {

  static updateWmsParams = (params, resourceId) => {
    const { bbox, width, height } = params;
    return {
      resource: resourceId,
      extent: bbox,
      size: width + ',' + height,
      timestamp: Date.now(),
    };
  }

  static getLayerAdapterOptions(options: NgwLayerOptions, webMap: WebMap, baseUrl) {
    let adapter = options.adapter || 'IMAGE';
    let url = baseUrl;
    const layerAdapters = webMap.getLayerAdapters();
    const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
    if (adapter === 'IMAGE') {
      if (isImageAllowed) {
        url += '/api/component/render/image';
        return {
          url,
          id: String(options.id),
          resourceId: options.id,
          updateWmsParams: (params) => NgwKit.updateWmsParams(params, options.id)
        };
      } else {
        adapter = 'TILE';
      }
    }
    if (adapter === 'TILE') {
      url += '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
      return { url, id: String(options.id), adapter, layer_adapter: adapter };
    }
  }

  static addNgwLayer(options: NgwLayerOptions, webMap: WebMap, baseUrl) {
    let adapter = options.adapter || 'IMAGE';
    const layerAdapters = webMap.getLayerAdapters();
    const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
    if (!isImageAllowed) {
      adapter = 'TILE';
    }
    if (adapter === 'IMAGE' || adapter === 'TILE') {
      return webMap.addLayer(adapter,
        NgwKit.getLayerAdapterOptions(options, webMap, baseUrl)
      );
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

  getSettings(webMap?: WebMap) {
    return new Promise((resolve) => {
      this.connector.request('resource.item', { id: this.resourceId }).then((data) => {
        const webmap = data.webmap;
        if (webmap) {
          this._updateItemsParams(webmap.root_item, webMap);
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

    webMap.emitter.emit('start-identify', { ev });
    const geom = webMap.requestGeomString(ev.pixel, this.pixelRadius);
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

  private _updateItemsParams(item, webMap: WebMap) {
    if (item) {
      if (item.children) {
        item.children = item.children.map((x) => this._updateItemsParams(x, webMap));
      } else if (item.item_type === 'layer') {
        const url = fixUrlStr(this.url + '/api/component/render/image');
        item.url = url;
        item.resourceId = item.layer_style_id;
        item.updateWmsParams = (params) => NgwKit.updateWmsParams(params, item.resourceId);
        item = {
          ...item,
          ...NgwKit.getLayerAdapterOptions({
            adapter: item.layer_adapter.toUpperCase(),
            id: item.layer_style_id
          }, webMap, this.options.baseUrl)
        };
      }
    }
    return item;
  }
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
