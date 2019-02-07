import WebMap, {
  MapAdapter,
  StarterKit,
  ControlPositions,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerType,
  MapControl,
  MapControls,
  LayerAdapters,
  Type,
  LayerAdapter,
  AdapterOptions
} from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import QmsKit from '@nextgis/qms-kit';
import NgwKit from '@nextgis/ngw-kit';
import { getIcon } from '@nextgis/icons';

import 'leaflet/dist/leaflet.css';
import { onMapLoad, onLoad } from './decorators';
import { fixUrlStr, deepmerge, detectGeometryType, createAsyncAdapter } from './utils';
import { EventEmitter } from 'events';
// @ts-ignore
import { toWgs84 } from 'reproject';
import { GeoJsonObject } from 'geojson';
import { NgwMapOptions, NgwLayerOptions, ControlOptions } from './interfaces';

const epsg = {
  // tslint:disable-next-line:max-line-length
  'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
};

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

export class NgwMap {

  static utils = { fixUrlStr };
  static decorators = { onMapLoad };
  static getIcon = getIcon;
  static toWgs84 = (geojson: GeoJsonObject) => toWgs84(geojson, epsg['EPSG:3857'], epsg);

  options: NgwMapOptions = {
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
    },
    geoJsonDefaultPaint: {
      circle: {
        type: 'circle',
        color: 'blue',
        opacity: 1,
        radius: 6,
        stroke: false
      },
      path: {
        type: 'path',
        color: 'blue',
        opacity: 1,
        stroke: false,
        weight: 1
      },
      icon: getIcon({ shape: 'circle' })
    }
  };

  webMap: WebMap;
  emitter = new EventEmitter();
  connector: NgwConnector;
  _eventsStatus: { [eventName: string]: boolean } = {};
  protected _ngwLayers: { [layerName: string]: LayerAdapter } = {};

  constructor(mapAdapter: MapAdapter, options: NgwMapOptions) {
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
    this._addEventsListeners();
  }

  fit() {
    const { center, zoom, bounds } = this.options;
    if (center) {
      this.webMap.setCenter(center);
      if (zoom) {
        this.webMap.setZoom(zoom);
      }
    } else if (bounds) {
      this.fitBounds(bounds);
    }
  }

  /**
   * top, left, bottom, right
   */
  fitBounds(bounds: [number, number, number, number]) {
    const [left, bottom, right, top] = bounds;
    // [extent_left, extent_bottom, extent_right, extent_top];
    this.webMap.fit([left, bottom, right, top]);
  }

  @onLoad('control:created')
  addControl<K extends keyof MapControls>(control: MapControl, position: ControlPositions, options?: MapControls[K]) {
    this.webMap.addControl(control, position, options);
  }

  @onMapLoad()
  async addNgwLayer(
    options: NgwLayerOptions,
    adapterOptions?: AdapterOptions): Promise<LayerAdapter | undefined> {

    if (options.adapter === 'GEOJSON') {
      const geojsonAdapterCb = this.connector.makeQuery('/api/resource/{id}/geojson', {
        id: options.id
      }).then((data) => {
        data = NgwMap.toWgs84(data);
        return this._updateGeojsonAdapterOptions({ data, id: String(options.id) });
      });
      const adapter = createAsyncAdapter(
        'GEOJSON',
        geojsonAdapterCb,
        this.webMap.mapAdapter
      );
      return this.addGeoJsonLayer(
        adapterOptions || {},
        adapter
      );
    } else if (this.options.baseUrl) {
      const adapter = NgwKit.addNgwLayer(options, this.webMap, this.options.baseUrl);
      if (adapter) {
        return adapter.then((layer) => {
          if (layer) {
            this._ngwLayers[layer.name] = layer;
            this.webMap.showLayer(layer.name);
            return layer;
          }
        });
      }
    }
  }

  @onMapLoad()
  addGeoJsonLayer<K extends keyof LayerAdapters>(
    opt: GeoJsonAdapterOptions,
    adapter?: K | Type<LayerAdapter>) {

    opt = opt || {};
    opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
    opt.unselectOnSecondClick = opt.unselectOnSecondClick !== undefined ? opt.unselectOnSecondClick : true;
    if (!adapter) {
      opt = this._updateGeojsonAdapterOptions(opt);
    }
    return this.webMap.addLayer(adapter || 'GEOJSON', opt).then((layer) => {
      this.webMap.showLayer(layer.name);
      return layer;
    });
  }

  zoomToLayer(id: string | number) {
    if (this._ngwLayers[id]) {
      return this.connector.request('resource.item', { id: Number(id) }).then((resp) => {
        if (resp) {
          if (resp.resource.cls === 'raster_style') {
            return this.connector.request('resource.item', {
              id: resp.resource.parent.id
            }).then((res) => {
              return this._fitNgwLayerExtend(res.resource.id);
            });
          } else {
            return this._fitNgwLayerExtend(Number(id));
          }
        }
      });
    }
  }

  private _updateGeojsonAdapterOptions(opt: GeoJsonAdapterOptions): GeoJsonAdapterOptions {
    if (opt.data) {
      const geomType = typeAlias[detectGeometryType(opt.data)];
      const p = opt.paint;
      if (typeof p === 'object') {
        // define parameter if not specified
        p.type = p.type ||
          (geomType === 'fill' || geomType === 'line') ?
          'path' :
          ('html' in p || 'className' in p) ?
            'icon' :
            geomType;

        if (this.options.geoJsonDefaultPaint) {
          if (p.type === 'circle') {
            opt.paint = { ...this.options.geoJsonDefaultPaint.circle, ...p };
          } else if (p.type === 'path') {
            opt.paint = { ...this.options.geoJsonDefaultPaint.path, ...p };
          } else if (p.type === 'icon') {
            opt.paint = { ...this.options.geoJsonDefaultPaint.icon, ...p };
          }
        }
      }
      opt.type = geomType;
    }
    return opt;
  }

  private _fitNgwLayerExtend(id: number) {
    return this.connector.request('layer.extent', { id }).then((resp) => {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      this.fitBounds([maxLat, maxLon, minLat, minLon]);
    });
  }

  private _createWebMap() {
    return this.webMap.create({
      ...this.options
    }).then(() => {
      this._emitStatusEvent('map:created');
      if (this.options.qmsId) {
        this.webMap.addBaseLayer('QMS', {
          id: this.options.qmsId,
          qmsid: this.options.qmsId
        }).then((layer) => {
          this.webMap.showLayer(layer.name);
        });
      }

      this.fit();
    });
  }

  private _addControls() {
    if (this.options.controls) {
      this.options.controls.forEach((x) => {
        let controlOptions: ControlOptions = {};
        if (typeof x === 'string' && this.options.controlsOptions) {
          controlOptions = this.options.controlsOptions[x];
        }
        const { position, ...options } = controlOptions;
        this.webMap.addControl(x, position || 'top-left', options);
      });
    }
    this._emitStatusEvent('control:created');
  }

  private _addEventsListeners() {
    this.webMap.emitter.on('click', (d) => this.emitter.emit('click', d));
    this.webMap.emitter.on('layer:click', (d) => this.emitter.emit('layer:click', d));
  }

  private _emitStatusEvent(event: string) {
    this._eventsStatus[event] = true;
    this.emitter.emit(event);
  }
}
