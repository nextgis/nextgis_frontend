import { WebMap, MapAdapter } from '@nextgis/webmap';
import { NgwConnector } from '@nextgis/ngw-connector';
import { QmsKit } from '@nextgis/qms-kit';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';

import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';

import { fixUrlStr } from './utils';

export interface MapOptions {
  target: string;
  qmsId: number;
  baseUrl: string;
  center?: [number, number];
  zoom?: number;
  bounds?: [number, number, number, number];
}

export interface NgwLayerOptions {
  id: number;
  adapter: 'IMAGE' | 'TILE';
}

export default class NgwMap {

  static utils = {fixUrlStr};
  static decorators = {onMapLoad};

  options: MapOptions = {
    target: 'map',
    qmsId: 465,
    baseUrl: 'http://dev.nextgis.com/sandbox',
  };

  webMap: WebMap;

  isLoaded: boolean = false;
  connector: NgwConnector;
  _ngwLayers = {};

  constructor(mapAdapter: MapAdapter, options: MapOptions) {
    this.options = { ...this.options, ...options };
    this.connector = new NgwConnector({ baseUrl: this.options.baseUrl });
    this.webMap = new WebMap({
      mapAdapter,
      starterKits: [new QmsKit()]
    });
    this._createWebMap().then(() => {
      this._addControls();
      this.isLoaded = true;
    });
  }

  fit() {
    const { center, zoom, bounds } = this.options;
    if (center) {
      this.webMap.map.setCenter(center);
      if (zoom) {
        this.webMap.map.setZoom(zoom);
      }
    } else if (bounds) {
      this.fitBounds(bounds);
    }
  }

  /**
   * top, left, bottom, right
   */
  fitBounds(bound: [number, number, number, number]) {
    this.webMap.map.fit(bound);
  }

  @onMapLoad()
  addNgwLayer(options: NgwLayerOptions) {
    const adapter = options.adapter || 'IMAGE';
    if (adapter === 'IMAGE' || adapter === 'TILE') {
      const url = fixUrlStr(this.options.baseUrl + '/api/component/render/image');
      return this.webMap.map.addLayer(adapter, { url, id: String(options.id) }).then((layer) => {
        this._ngwLayers[layer.name] = layer;
        this.webMap.map.showLayer(layer.name);
        return layer.name;
      });
    } else {
      throw new Error(adapter + ' not supported yet. Only TILE');
    }
  }

  zoomToLayer(id: string | number) {
    if (this._ngwLayers[id]) {
      return this.connector.request('resource.item', { id }).then((resp) => {
        if (resp) {
          if (resp.resource.cls === 'raster_style') {
            return this.connector.request('resource.item', {
              id: resp.resource.parent.id
            }).then((res) => {
              return this._fitNgwLayerExtend(res.resource.id);
            });
          } else {
            return this._fitNgwLayerExtend(id);
          }
        }
      });
    }
  }

  private _fitNgwLayerExtend(id) {
    return this.connector.request('layer.extent', { id }).then((resp) => {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      this.fitBounds([maxLat, maxLon, minLat, minLon]);
    });
  }

  private _createWebMap() {
    return this.webMap.create({
      target: this.options.target
    }).then(() => {
      if (this.options.qmsId) {
        this.webMap.addBaseLayer(String(this.options.qmsId), 'QMS', {
          qmsid: this.options.qmsId
        }).then((layer) => {
          this.webMap.map.showLayer(layer.name);
        });
      }

      this.fit();
      this.webMap.emitter.emit('map:created');
      // @ts-ignore
      window.lmap = this.webMap.map.map;
    });
  }

  private _addControls() {

    this.webMap.map.addControl('ZOOM', 'top-left');

    this.webMap.map.addControl('ATTRIBUTION', 'bottom-right', {
      customAttribution: [
        '<a href="http://nextgis.ru" target="_blank">©NextGIS</a>',
      ]
    });
  }
}
