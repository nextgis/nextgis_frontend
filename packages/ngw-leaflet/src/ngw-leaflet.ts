import { WebMap } from '@nextgis/webmap';
import { NgwConnector } from '@nextgis/ngw-connector';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';
import { QmsKit } from '@nextgis/qms-kit';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';

import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';
import { NgwImageAdapter } from './ngw-image-adapter';
import { fixUrlStr } from './utils';

export interface MapOptions {
  target: string;
  qmsId: number;
  baseUrl: string;
  center?: [number, number];
  zoom?: number;
  bound?: [number, number, number, number];
}

export interface NgwLayerOptions {
  id: number;
  adapter: 'IMAGE' | 'TILE';
}

export default class NgwLeaflet {

  options: MapOptions = {
    target: 'map',
    qmsId: 465,
    baseUrl: 'http://dev.nextgis.com/sandbox',
  };

  webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
    starterKits: [new QmsKit()]
  });

  isLoaded: boolean = false;
  connector: NgwConnector;
  private _ngwLayers = {};

  constructor(options: MapOptions) {
    this.options = { ...this.options, ...options };
    this.connector = new NgwConnector({ baseUrl: this.options.baseUrl });
    this._createWebMap().then(() => {
      this._addControls();
      this.isLoaded = true;
    });
  }

  fit() {
    const { center, zoom, bound } = this.options;
    if (center) {
      this.webMap.map.setCenter(center);
      if (zoom) {
        this.webMap.map.setZoom(zoom);
      }
    } else if (bound) {
      this.webMap.map.fit(bound);
    }
  }

  @onMapLoad()
  addNgwLayer(options: NgwLayerOptions) {
    const adapter = options.adapter || 'IMAGE';
    if (adapter === 'IMAGE' || adapter === 'TILE') {
      let url = this.options.baseUrl;
      let addLayerPromise;
      if (adapter === 'IMAGE') {
        url += '/api/component/render/image';
        addLayerPromise = this.webMap.map.addLayer(NgwImageAdapter, { url, id: String(options.id) });
      } else if (adapter === 'TILE') {
        url += '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
        addLayerPromise = this.webMap.map.addLayer(adapter, { url });
      }
      return addLayerPromise.then((layer) => {
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
      this.webMap.map.fit([maxLat, maxLon, minLat, minLon]);
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
