import NgwConnector from '@nextgis/ngw-connector';
import WebMap, { StarterKit, MapClickEvent } from '@nextgis/webmap';
import { updateWmsParams, getLayerAdapterOptions, addNgwLayer } from './utils';
import { NgwKitOptions, RequestOptions, WebMapAdapterOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';

export default class NgwKit implements StarterKit {

  static updateWmsParams = updateWmsParams;

  static getLayerAdapterOptions = getLayerAdapterOptions;

  static addNgwLayer = addNgwLayer;

  options: NgwKitOptions = {};
  url: string;
  connector: NgwConnector;
  webMap?: WebMap;

  // Radius for searching objects in pixels
  pixelRadius = 10; // webmapSettings.identify_radius,

  private _adapter?: WebMapLayerAdapter;

  constructor(options?: NgwKitOptions) {
    this.options = { ...this.options, ...options };
    if (this.options.pixelRadius) {
      this.pixelRadius = this.options.pixelRadius;
    }
    if (this.options.baseUrl) {
      this.url = this.options.baseUrl;
    } else {
      throw new Error('url is not defined');
    }
    this.connector = new NgwConnector({ baseUrl: this.url, auth: this.options.auth });
  }

  async onLoadSync(webMap: WebMap) {
    if (this.options.resourceId && this.options.baseUrl) {
      let resourceIds: number[];
      if (Array.isArray(this.options.resourceId)) {
        resourceIds = this.options.resourceId;
      } else {
        resourceIds = [this.options.resourceId];
      }
      if (resourceIds.length) {
        for (const r of resourceIds) {
          const layer = await webMap.addLayer(WebMapLayerAdapter, {
            id: String(r),
            connector: this.connector,
            baseUrl: this.options.baseUrl,
            webMap
          });
          if (layer && layer.name) {
            webMap.showLayer(layer.name);
            if (layer.getExtent) {
              const extent = await layer.getExtent();
              if (extent) {
                webMap.fit(extent);
              }
            }
          }
        }
      }
    }
  }

  getLayerAdapters() {
    return Promise.resolve([this._getlayerAdapter()]);
  }

  onMapClick(ev: MapClickEvent, webMap: WebMap) {
    // this.sendIdentifyRequest(ev, webMap);
  }

  // options is temporal to set list of layers id, because layers id is not item parameter now
  sendIdentifyRequest(ev: MapClickEvent, webMap: WebMap, options: { layers?: string[] } = {}) {

    webMap.emitter.emit('start-identify', { ev });
    const geom = webMap.requestGeomString(ev.pixel, this.pixelRadius);
    if (options.layers) {
      const layers: string[] = options.layers;
      if (!layers) {
        // TODO: layer_style_id - 1 is hardcode to get layers id for NGW webmap
        // layers = webMap.layers.tree.getDescendants().filter((x) => {
        //   return x.item.item_type === 'layer' && x.properties.get('visibility');
        // }).map((x) => String(Number(x.item.layer_style_id) - 1));
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

  private _getlayerAdapter() {
    return {
      name: 'WEBMAP',
      createAdapter: (webmap: WebMap) => Promise.resolve(this._createAdapter(webmap)),
    };
  }

  private _createAdapter(webMap: WebMap) {
    if (!this._adapter && this.options.baseUrl) {
      this.webMap = webMap;
      this._adapter = new WebMapLayerAdapter(this.webMap, {
        connector: this.connector,
        baseUrl: this.options.baseUrl,
        webMap
      });
    }
    return this._adapter;
  }

}
