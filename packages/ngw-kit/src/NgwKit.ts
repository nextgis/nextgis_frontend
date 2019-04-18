/**
 * @module ngw-kit
 */

import NgwConnector, { CancelablePromise } from '@nextgis/ngw-connector';
import WebMap, { StarterKit, MapClickEvent, Type } from '@nextgis/webmap';
import {
  updateWmsParams,
  getLayerAdapterOptions,
  addNgwLayer,
  extendWebMapLayerAdapter,
  getCirclePoly,
  degrees2meters
} from './utils';
import { NgwKitOptions, WebMapAdapterOptions, IdentifyRequestOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';

export class NgwKit implements StarterKit {

  static updateWmsParams = updateWmsParams;

  static getLayerAdapterOptions = getLayerAdapterOptions;

  static addNgwLayer = addNgwLayer;

  url: string;
  connector: NgwConnector;
  webMap?: WebMap;

  // Radius for searching objects in pixels
  pixelRadius = 10; // webmapSettings.identify_radius,

  private _webmapLayersIds: { isLoading: boolean, ids: string[] } = { isLoading: false, ids: [] };

  constructor(public options: NgwKitOptions) {

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
      // TODO: resources from array
      const resourceIds = [this.options.resourceId];

      if (resourceIds.length) {
        for (const r of resourceIds) {
          const options: WebMapAdapterOptions = {
            resourceId: r,
            connector: this.connector,
            baseUrl: this.options.baseUrl,
            webMap
          };
          const layer = await webMap.addLayer(WebMapLayerAdapter, options) as WebMapLayerAdapter;
          if (this.options.identification) {
            const ids = await this._getWebmapIds(layer);
            if (ids) {
              this._webmapLayersIds.ids = ids.filter((x) => x !== undefined).map((x) => x.resource.parent.id);
              webMap.emitter.on('click', (ev) => this._onMapClick(ev, webMap));
            }
          }
          if (layer) {
            webMap.showLayer(layer);
            if (layer.getExtent) {
              const extent = await layer.getExtent();
              if (extent) {
                webMap.fitBounds(extent);
              }
            }
          }
        }
      }
    }
  }

  getLayerAdapters() {
    return Promise.resolve([this._getLayerAdapter()]);
  }

  // options is temporal to set list of layers id, because layers id is not item parameter now
  async sendIdentifyRequest(ev: MapClickEvent, webMap: WebMap, options: { layers?: string[] } = {}) {

    // webMap.emitter.emit('start-identify', { ev });
    const geom = getCirclePoly(ev.latLng.lng, ev.latLng.lat, this.pixelRadius);
    const polygon: number[] = [];

    geom.forEach(([lng, lat]) => {
      const [x, y] = degrees2meters(lng, lat);
      polygon.push(y);
      polygon.push(x);
    });

    const wkt = `POLYGON((${polygon.join(' ')}))`;

    const layers: string[] = options.layers ? options.layers : this._webmapLayersIds.ids;

    const data: IdentifyRequestOptions = {
      geom: wkt,
      srs: 3857,
      layers,
    };
    return this.connector.post('feature_layer.identify', { data }).then((resp) => {
      // webMap.emitter.emit('identify', { ev, data: resp });
      return resp;
    });

  }

  private async _getWebmapIds(layer: WebMapLayerAdapter) {
    const webMapItem = layer.layer;
    if (webMapItem && webMapItem.item.item_type === 'root') {
      const layers = webMapItem.item.children;
      const promises: Array<CancelablePromise<any>> = [];
      layers.forEach((x) => {
        if (x.item_type === 'layer') {
          const id = x.layer_style_id;
          promises.push(this.connector.get('resource.item', {}, { id }));
        }
      });
      return Promise.all(promises);
      // const id = item['layer_style_id']
    }
  }

  private _onMapClick(ev: MapClickEvent, webMap: WebMap) {
    this.sendIdentifyRequest(ev, webMap);
  }

  private _getLayerAdapter() {
    return {
      name: 'WEBMAP',
      createAdapter: (webmap: WebMap) => Promise.resolve(this._createAdapter(webmap)),
    };
  }

  private _createAdapter(webMap: WebMap): Type<WebMapLayerAdapter> {
    const connector = this.connector;
    const baseUrl = this.options.baseUrl;
    return extendWebMapLayerAdapter({
      webMap, connector, baseUrl
    });
  }

}
