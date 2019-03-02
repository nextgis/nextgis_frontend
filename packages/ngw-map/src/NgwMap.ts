/**
 * @module ngw-map
 */

import WebMap, {
  MapAdapter,
  StarterKit,
  ControlPositions,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerType,
  MapControl,
  MapControls,
  LayerAdaptersOptions,
  Type,
  LayerAdapter,
  AdapterOptions
} from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import QmsKit, { QmsAdapterOptions } from '@nextgis/qms-kit';
import NgwKit, { NgwLayerOptions } from '@nextgis/ngw-kit';
import { getIcon } from '@nextgis/icons';

import 'leaflet/dist/leaflet.css';
import { onMapLoad, onLoad } from './decorators';
import { fixUrlStr, deepmerge, detectGeometryType, createAsyncAdapter } from './utils';
import { EventEmitter } from 'events';
// @ts-ignore
import { toWgs84 } from 'reproject';
import { GeoJsonObject } from 'geojson';
import { NgwMapOptions, ControlOptions } from './interfaces';

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

/**
 * Base class containing the logic of interaction WebMap with NextGIS services.
 */
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
    vectorLayersDefaultPaint: {
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
  protected _ngwLayers: {
    [layerName: string]: {
      layer: LayerAdapter,
      resourceId: number
    }
  } = {};

  constructor(mapAdapter: MapAdapter, options: NgwMapOptions) {
    this.options = deepmerge(this.options, options);
    this.connector = new NgwConnector({ baseUrl: this.options.baseUrl });
    const kits: StarterKit[] = [new QmsKit()];
    // const kits: any[] = [new QmsKit()];
    if (this.options.baseUrl && this.options.webmapId) {
      const resourceId = this.options.webmapId;

      kits.push(new NgwKit({
        baseUrl: this.options.baseUrl,
        resourceId,
      }));
    }
    this.webMap = new WebMap({
      mapAdapter,
      starterKits: kits
    });

    this._createWebMap().then(() => {
      const container = this.webMap.getContainer();
      if (container) {
        container.classList.add('ngw-map-container');
      }
      this._addControls();
    });
    this._addEventsListeners();
  }

  /**
   * Pans and zooms the map to the position specified in the options
   */
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

  fitBounds(bounds: [number, number, number, number]) {
    const [left, bottom, right, top] = bounds;
    // [extent_left, extent_bottom, extent_right, extent_top];
    this.webMap.fit([left, bottom, right, top]);
  }

  /**
   * Organized addition to the map design and controls elements,
   * calling `control.onAdd(this.webMap.mapAdapter)`
   * @param control - object with onAdd and onRemove methods
   *                or a string value indicating the name of the control installed in the map adapter
   * @param position - position relative to the map angles
   * @param [options] - initialization parameters if the control is set as a string value
   *
   * @example
   * ```javascript
   * ngwMap.addControl(new CustomControl(), 'bottom-left');
   * ngwMap.addControl('ZOOM', {position: 'top-right'})
   * ```
   */
  @onLoad('control:created')
  addControl<K extends keyof MapControls>(control: MapControl, position: ControlPositions, options?: MapControls[K]) {
    this.webMap.addControl(control, position, options);
  }

  /**
   * Add raster layer by NGW style id or vector data layer by recource id.
   * @param options - set layer identification parameters and render method.
   * @param [adapterOptions] - parameters for the choised adapter
   *
   * @example
   * ```javascript
   * var ngwMap = new NgwMap({ baseUrl: 'https://demo.nextgis.com', target: 'map'});
   * // add raster layer resourceId is the style of 4004 layer
   * ngwMap.addNgwLayer({resourceId: 4005});
   * // add vector data from layer GEOJSON source
   * ngwMap.addNgwLayer({
   *   resourceId: 4038,
   *   adapter: 'GEOJSON'
   * }, {
   *   paint: { color: 'red' }
   * });
   * ```
   */
  @onMapLoad()
  async addNgwLayer(
    options: NgwLayerOptions,
    adapterOptions?: any): Promise<LayerAdapter | undefined> {

    if (!options.resourceId) {
      throw new Error('resourceId is required parameter to add NGW layer');
    }

    if (options.adapter === 'GEOJSON') {
      const geojsonAdapterCb = this.connector.makeQuery('/api/resource/{id}/geojson', {
        id: options.resourceId
      }).then((data) => {
        data = NgwMap.toWgs84(data);
        const geoJsonOptions: GeoJsonAdapterOptions = {
          data,
        };
        if (options.id) {
          geoJsonOptions.id = options.id;
        }
        return this._updateGeojsonAdapterOptions(geoJsonOptions);
      });
      const adapter = createAsyncAdapter(
        'GEOJSON',
        geojsonAdapterCb,
        this.webMap.mapAdapter
      );
      const layer = await this.addGeoJsonLayer(
        adapterOptions || {},
        adapter
      );
      const id = layer && this.webMap.getLayerId(layer);
      if (id) {
        this._ngwLayers[id] = { layer, resourceId: options.resourceId };
        return layer;
      }
    } else if (this.options.baseUrl) {

      const adapter = NgwKit.addNgwLayer(options, this.webMap, this.options.baseUrl);
      if (adapter) {
        return adapter.then((layer) => {
          const id = layer && this.webMap.getLayerId(layer);
          if (layer && id) {
            this._ngwLayers[id] = { layer, resourceId: options.resourceId };
            this.webMap.showLayer(layer);
            return layer;
          }
        });
      }
    }
  }

 /**
  * Create layer from data. Set style and behavior for selection.
  */
  @onMapLoad()
  addGeoJsonLayer<K extends keyof LayerAdaptersOptions>(
    opt: GeoJsonAdapterOptions,
    adapter?: K | Type<LayerAdapter>) {

    opt = opt || {};
    opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
    opt.unselectOnSecondClick = opt.unselectOnSecondClick !== undefined ? opt.unselectOnSecondClick : true;
    if (!adapter) {
      opt = this._updateGeojsonAdapterOptions(opt);
    }
    return this.webMap.addLayer(adapter || 'GEOJSON', opt).then((layer) => {
      this.webMap.showLayer(layer);
      return layer;
    });
  }

  /**
   * Move map to layer. If the layer is NGW resource, extent will be received from the server
   * @param layerDef
   */
  zoomToLayer(layerDef: string | number | LayerAdapter) {
    let id: string | undefined;
    if (typeof layerDef === 'string' || typeof layerDef === 'number') {
      id = String(id);
    } else {
      id = layerDef.id;
    }
    const ngwLayer = id && this._ngwLayers[id];
    if (ngwLayer) {
      const resourceId = ngwLayer.resourceId;
      return this.connector.request('resource.item', { id: resourceId }).then((resp) => {
        if (resp) {
          if (resp.resource.cls === 'raster_style') {
            return this.connector.request('resource.item', {
              id: resp.resource.parent.id
            }).then((res) => {
              return this._fitNgwLayerExtend(res.resource.id);
            });
          } else {
            return this._fitNgwLayerExtend(resourceId);
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
        p.type = p.type ? p.type :
          (geomType === 'fill' || geomType === 'line') ?
            'path' :
            ('html' in p || 'className' in p) ?
              'icon' :
              geomType;

        if (this.options.vectorLayersDefaultPaint) {
          if (p.type === 'circle') {
            opt.paint = { ...this.options.vectorLayersDefaultPaint.circle, ...p };
          } else if (p.type === 'path') {
            opt.paint = { ...this.options.vectorLayersDefaultPaint.path, ...p };
          } else if (p.type === 'icon') {
            opt.paint = { ...this.options.vectorLayersDefaultPaint.icon, ...p };
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
      this.fitBounds([minLon, minLat, maxLon, maxLat]);
    });
  }

  private _createWebMap() {
    return this.webMap.create({
      ...this.options
    }).then(() => {
      this._emitStatusEvent('map:created');
      if (this.options.qmsId) {
        let qmsId: number;
        let qmsLayerName: string | undefined;
        if (Array.isArray(this.options.qmsId)) {
          qmsId = this.options.qmsId[0];
          qmsLayerName = this.options.qmsId[1];
        } else {
          qmsId = this.options.qmsId;
        }
        const qmsLayerOptions: QmsAdapterOptions = {
          qmsId,
        };
        if (qmsLayerName) {
          qmsLayerOptions.id = qmsLayerName;
        }

        this.webMap.addBaseLayer('QMS', qmsLayerOptions).then((layer) => {
          this.webMap.showLayer(layer);
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
