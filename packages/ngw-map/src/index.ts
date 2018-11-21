import WebMap, {
  MapAdapter,
  StarterKit,
  MapOptions as MO,
  ControlPositions,
  GeoJsonAdapterLayerPaint
} from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import QmsKit from '@nextgis/qms-kit';
import NgwKit from '@nextgis/ngw-kit';

import 'leaflet/dist/leaflet.css';
import { onMapLoad } from './decorators';
import { fixUrlStr, deepmerge } from './utils';
import { EventEmitter } from 'events';
import { GeoJsonObject } from 'geojson';
import { toWgs84 } from 'reproject';

const epsg = {
  // tslint:disable-next-line:max-line-length
  'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
};

export interface ControlOptions {
  position?: ControlPositions;
}

export interface MapOptions extends MO {
  target: string | HTMLElement;
  qmsId?: number;
  webmapId?: number;
  baseUrl: string;
  bounds?: [number, number, number, number];
}

export interface NgwLayerOptions {
  id: number;
  adapter?: 'IMAGE' | 'TILE' | 'GEOJSON';
}

export default class NgwMap {

  static utils = { fixUrlStr };
  static decorators = { onMapLoad };

  options: MapOptions = {
    target: 'map',
    baseUrl: 'http://dev.nextgis.com/sandbox',
    controls: ['ZOOM', 'ATTRIBUTION'],
    controlsOptions: {
      ZOOM: { position: 'top-left' },
      ATTRIBUTION: {
        position: 'bottom-right',
        customAttribution: [
          '<a href="http://nextgis.ru" target="_blank">©NextGIS</a>',
        ]
      }
    }
  };

  webMap: WebMap;
  emitter = new EventEmitter();
  isLoaded: boolean = false;
  connector: NgwConnector;
  _ngwLayers = {};

  constructor(mapAdapter: MapAdapter, options: MapOptions) {
    this.options = deepmerge(this.options, options);
    this.connector = new NgwConnector({ baseUrl: this.options.baseUrl });
    const kits: StarterKit[] = [new QmsKit()];
    // const kits: any[] = [new QmsKit()];
    if (this.options.webmapId) {
      kits.push(new NgwKit({
        baseUrl: this.options.baseUrl,
        resourceId: this.options.webmapId
      }));
    }
    this.webMap = new WebMap({
      mapAdapter,
      starterKits: kits
    });
    this._createWebMap().then(() => {
      this._addControls();
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
  fitBounds(bounds: [number, number, number, number]) {
    const [top, left, bottom, right] = bounds;
    // [extent_left, extent_bottom, extent_right, extent_top];
    this.webMap.map.fit([left, bottom, right, top]);
  }

  @onMapLoad()
  async addNgwLayer(options: NgwLayerOptions, adapterOptions?) {
    if (options.adapter === 'GEOJSON') {
      let data = await this.connector.makeQuery('/api/resource/{id}/geojson', {
        id: options.id
      });
      data = toWgs84(data, undefined, epsg);
      return this.addGeoJsonLayer(data, adapterOptions);
    } else {
      return NgwKit.addNgwLayer(options, this.webMap, this.options.baseUrl).then((layer) => {
        this._ngwLayers[layer.name] = layer;
        this.webMap.map.showLayer(layer.name);
        return layer.name;
      });
    }
  }

  @onMapLoad()
  addGeoJsonLayer(data: GeoJsonObject, paint: GeoJsonAdapterLayerPaint) {
    return this.webMap.map.addLayer('GEOJSON', { data, paint }).then((layer) => {
      this.webMap.map.showLayer(layer.name);
      return layer.name;
    });
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
      this.isLoaded = true;
      this.emitter.emit('map:created');
      if (this.options.qmsId) {
        this.webMap.addBaseLayer(String(this.options.qmsId), 'QMS', {
          qmsid: this.options.qmsId
        }).then((layer) => {
          this.webMap.map.showLayer(layer.name);
        });
      }

      this.fit();
      // @ts-ignore
      // window.lmap = this.webMap.map.map;
    });
  }

  private _addControls() {
    this.options.controls.forEach((x) => {
      let controlOptions: ControlOptions = { position: 'top-left' };
      if (typeof x === 'string') {
        controlOptions = this.options.controlsOptions[x];
      }
      const { position, ...options } = controlOptions;
      this.webMap.map.addControl(x, position, options);
    });
  }
}
