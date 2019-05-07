/**
 * @module ngw-map
 */
import WebMap, {
  MapAdapter,
  StarterKit,
  ControlPositions,
  MapControls,
  LayerAdapter,
  WebMapEvents
} from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import QmsKit, { QmsAdapterOptions } from '@nextgis/qms-kit';
import NgwKit, { NgwLayerOptions } from '@nextgis/ngw-kit';
import { getIcon } from '@nextgis/icons';

import { onMapLoad } from './decorators';
import { fixUrlStr, deepmerge } from './utils';

import { NgwMapOptions, ControlOptions, NgwMapEvents } from './interfaces';

const OPTIONS: NgwMapOptions = {
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

function prepareWebMapOptions(mapAdapter: MapAdapter, options: NgwMapOptions) {
  const opt: NgwMapOptions = deepmerge(OPTIONS, options);
  const kits: StarterKit[] = [new QmsKit()];
  const resourceId = opt.webmapId;
  kits.push(new NgwKit({
    baseUrl: opt.baseUrl,
    auth: opt.auth,
    resourceId,
    identification: opt.identification
  }));
  return {
    mapAdapter,
    starterKits: kits
  };
}

/**
 * Base class containing the logic of interaction WebMap with NextGIS services.
 *
 * @example
 * ```javascript
 * import NgwMap from '@nextgis/ngw-map';
 * import MapAdapter from '@nextgis/leaflet-map-adapter';
 * // styles are not included in the leaflet-map-adapter
 * import 'leaflet/dist/leaflet.css';
 *
 * const ngwMap = new NgwMap(new MapAdapter(), {
 *   target: 'map',
 *   qmsId: 487,
 *   baseUrl: 'https://demo.nextgis.com',
 *   webmapId: 3985
 * });
 * ```
 */
export class NgwMap<M = any, L = any, C = any> extends WebMap<M, L, C, NgwMapEvents> {

  static utils = { ...WebMap.utils, fixUrlStr };
  static decorators = { onMapLoad, ...WebMap.decorators };
  static getIcon = getIcon;
  static toWgs84 = NgwKit.utils.toWgs84;

  options: NgwMapOptions<C> = {};
  connector: NgwConnector;

  protected _ngwLayers: {
    [layerName: string]: {
      layer: LayerAdapter,
      resourceId: number
    }
  } = {};

  /**
   * @param mapAdapter #noapi
   * @param options
   */
  constructor(mapAdapter: MapAdapter, options: NgwMapOptions<C>) {
    super(prepareWebMapOptions(mapAdapter, options));

    this.options = deepmerge(OPTIONS, options);
    this.connector = options.connector ||
      new NgwConnector({ baseUrl: this.options.baseUrl, auth: this.options.auth });

    this._createWebMap().then(() => {
      const container = this.getContainer();
      if (container) {
        container.classList.add('ngw-map-container');
      }
      this._addControls();
    });
  }

  /**
   * Pans and zooms the map to the initial position specified in the options
   */
  fit() {
    const { center, zoom, bounds } = this.options;
    if (center) {
      this.setCenter(center);
      if (zoom) {
        this.setZoom(zoom);
      }
    } else if (bounds) {
      this.fitBounds(bounds);
    }
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
   * ngwMap.addControl('ZOOM', 'top-right')
   * ```
   */
  @WebMap.decorators.onLoad<NgwMapEvents>('controls:create')
  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPositions,
    options?: MapControls[K]) {
    return super.addControl(controlDef, position, options);
  }

  /**
   * Add raster layer by NGW style id or vector data layer by resource id.
   * @param options - set layer identification parameters and render method.
   * @param [adapterOptions] - parameters for the selected adapter
   *
   * @example
   * ```javascript
   * var ngwMap = new NgwMap({ baseUrl: 'https://demo.nextgis.com', target: 'map' });
   * // add raster layer resourceId is the style of 4004 layer
   * ngwMap.addNgwLayer({ resourceId: 4005 });
   * // add vector data from layer GEOJSON source
   * ngwMap.addNgwLayer({
   *   resourceId: 4038,
   *   adapter: 'GEOJSON',
   *   adapterOptions: { paint: { color: 'red' } }
   * });
   * ```
   */
  @onMapLoad()
  async addNgwLayer(
    options: NgwLayerOptions): Promise<LayerAdapter | undefined> {

    if (!options.resourceId) {
      throw new Error('resourceId is required parameter to add NGW layer');
    }
    if (this.options.baseUrl) {
      const adapter = NgwKit.utils.addNgwLayer(options, this, this.options.baseUrl, this.connector);
      const layer = await this.addLayer(adapter, options.adapterOptions || {});
      const id = layer && this.getLayerId(layer);
      if (layer && id) {
        this._ngwLayers[id] = { layer, resourceId: options.resourceId };
        this.showLayer(layer);
      }
      return layer;
    }
  }

  /**
   * Move map to layer. If the layer is NGW resource, extent will be received from the server
   * @param layerDef
   *
   * @example
   * ```javascript
   * const ngwLayer = ngwMap.addNgwLayer({ id: 'ngw_layer_name', resourceId: 4005 });
   * ngwMap.zoomToLayer(ngwLayer);
   * ngwMap.zoomToLayer('ngw_layer_name');
   * ```
   */
  zoomToLayer(layerDef: string | LayerAdapter) {
    let id: string | undefined;
    if (typeof layerDef === 'string' || typeof layerDef === 'number') {
      id = String(id);
    } else {
      id = layerDef.id;
    }
    const ngwLayer = id && this._ngwLayers[id];
    if (ngwLayer) {
      const resourceId = ngwLayer.resourceId;
      return this.connector.get('resource.item', null, { id: resourceId }).then((resp) => {
        if (resp) {
          if (resp.resource.cls.indexOf('style') !== -1) {
            return this.connector.get('resource.item', null, {
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

  onLoad(event: keyof NgwMapEvents = 'ngw-map:create'): Promise<this> {
    return super.onLoad(event as keyof WebMapEvents);
  }

  private _fitNgwLayerExtend(id: number) {
    return this.connector.get('layer.extent', name, { id }).then((resp) => {
      if (resp) {
        const { maxLat, maxLon, minLat, minLon } = resp.extent;
        this.fitBounds([minLon, minLat, maxLon, maxLat]);
      }
    });
  }

  private async _createWebMap() {
    await this.create({ ...this.options });
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

      await this.addBaseLayer('QMS', qmsLayerOptions).then((layer) => {
        this.showLayer(layer);
      });
    }

    this.fit();
    this._emitStatusEvent('ngw-map:create', this);
  }

  private _addControls() {
    if (this.options.controls) {
      this.options.controls.forEach((x) => {
        let controlOptions: ControlOptions = {};
        if (typeof x === 'string' && this.options.controlsOptions) {
          controlOptions = this.options.controlsOptions[x];
        }
        const { position, ...options } = controlOptions;
        this.addControl(x, position || 'top-left', options);
      });
    }
    this._emitStatusEvent('controls:create');
  }
}
