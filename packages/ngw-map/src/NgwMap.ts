/**
 * @module ngw-map
 */
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

import { fixUrlStr, deepmerge } from '@nextgis/utils';
import WebMap, {
  MapAdapter,
  ControlPositions,
  MapControls,
  WebMapEvents,
  LayerDef,
  MapClickEvent,
  LayerAdapter,
  PropertiesFilter,
  FilterOptions,
  OnLayerClickOptions
} from '@nextgis/webmap';
import NgwConnector, {
  ResourceItem,
  CancelablePromise,
  FeatureLayersIdentify,
  FeatureItem,
  FeatureLayersIdentifyItems,
  LayerFeature
} from '@nextgis/ngw-connector';
import { QmsAdapterOptions } from '@nextgis/qms-kit';
import NgwKit, {
  NgwLayerOptions,
  ResourceAdapter,
  WebMapLayerItem,
  NgwLayerOptionsAdditional,
  NgwIdentify,
  KeynamedNgwLayerOptions,
  ResourceIdNgwLayerOptions
} from '@nextgis/ngw-kit';
import { getIcon } from '@nextgis/icons';

import { onMapLoad } from './decorators';
import { appendNgwResources, prepareWebMapOptions, OPTIONS } from './utils';

import {
  NgwMapOptions,
  ControlOptions,
  NgwMapEvents,
  NgwLayers
} from './interfaces';
import { Geometry, Feature, FeatureCollection } from 'geojson';

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
export class NgwMap<M = any, L = any, C = any, O = {}> extends WebMap<
  M,
  L,
  C,
  NgwMapEvents
> {
  static utils = {
    ...WebMap.utils,
    ...NgwKit.utils,
    fixUrlStr,
    deepmerge
  };
  static decorators = { onMapLoad, ...WebMap.decorators };
  static getIcon = getIcon;

  readonly emitter: StrictEventEmitter<
    EventEmitter,
    NgwMapEvents
  > = new EventEmitter();

  options: NgwMapOptions<C> & O = {} as NgwMapOptions<C> & O;
  connector!: NgwConnector;

  protected _ngwLayers: NgwLayers = {};
  private __selectFromNgwRaster?: (ev: MapClickEvent) => void;
  private __selectFromNgwVector?: (ev: OnLayerClickOptions) => void;

  /**
   * @param mapAdapter #noapi
   * @param options
   */
  constructor(mapAdapter: MapAdapter, options: NgwMapOptions<C> & O) {
    super(prepareWebMapOptions(mapAdapter, options));
    if (options.connector) {
      this.connector = options.connector;
    }
    this.options = deepmerge(OPTIONS, options);
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
    options?: MapControls[K]
  ) {
    return super.addControl(controlDef, position, options);
  }

  /**
   * Add any (style, vector, webmap) NGW layer by resource id.
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
    options: NgwLayerOptions
  ): Promise<ResourceAdapter | undefined> {
    const keyname = (options as KeynamedNgwLayerOptions).keyname;
    const resourceId = (options as ResourceIdNgwLayerOptions).resourceId;
    if (!keyname && !resourceId) {
      throw new Error(
        'resourceId or keyname is required parameter to add NGW layer'
      );
    }
    if (this.options.baseUrl || this.options.baseUrl === '') {
      try {
        const adapter = NgwKit.utils.addNgwLayer(
          options,
          this,
          this.options.baseUrl,
          this.connector
        );

        const layer = (await this.addLayer(adapter, {
          visibility: true,
          // TODO: all options into one object
          ...options,
          ...options.adapterOptions
        })) as ResourceAdapter;
        const id = layer && this.getLayerId(layer);
        if (layer && id) {
          this._ngwLayers[id] = { layer, resourceId: layer.resourceId };

          if (layer.options.baseLayer) {
            const visibleLayerBaseLayer = this.getActiveBaseLayer();
            if (visibleLayerBaseLayer) {
              return layer;
            }
          }
        }

        return layer;
      } catch (er) {
        console.error("can't add ngw layer", er);
      }
    }
  }

  async getNgwLayerItem(options: {
    resourceId: number;
    featureId: number;
  }): CancelablePromise<FeatureItem> {
    return NgwKit.utils.getNgwLayerItem({
      connector: this.connector,
      ...options
    });
  }

  async getNgwLayerItems(
    options: {
      resourceId: number;
      connector?: NgwConnector;
      filters?: PropertiesFilter;
    } & FilterOptions
  ): CancelablePromise<FeatureItem[]> {
    return NgwKit.utils.getNgwLayerItems({
      connector: this.connector,
      ...options
    });
  }

  async getNgwLayerFeature<
    G extends Geometry | null = Geometry,
    P extends Record<string, any> = Record<string, any>
  >(options: {
    resourceId: number;
    featureId: number;
  }): CancelablePromise<Feature<G, P>> {
    return NgwKit.utils.getNgwLayerFeature<G, P>({
      connector: this.connector,
      ...options
    });
  }

  async getNgwLayerFeatures<
    G extends Geometry | null = Geometry,
    P extends Record<string, any> = Record<string, any>
  >(
    options: {
      resourceId: number;
      connector?: NgwConnector;
      filters?: PropertiesFilter;
    } & FilterOptions
  ): CancelablePromise<FeatureCollection<G, P>> {
    return NgwKit.utils.getNgwLayerFeatures({
      connector: this.connector,
      ...options
    });
  }

  async getIdentifyGeoJson(
    identify: NgwIdentify,
    multiple = false
  ): CancelablePromise<Feature | undefined> {
    return NgwKit.utils.getIdentifyGeoJson({
      identify,
      connector: this.connector,
      multiple
    });
  }

  async getNgwLayers(): Promise<NgwLayers> {
    await this.onLoad();
    return this._ngwLayers;
  }

  async getNgwLayerByResourceId(id: number): Promise<LayerAdapter | undefined> {
    for (const n in this._ngwLayers) {
      const mem = this._ngwLayers[n];
      if (mem.resourceId === id) {
        return mem && mem.layer;
      } else if (mem.layer.getIdentificationIds) {
        const ids = await mem.layer.getIdentificationIds();
        if (ids && ids.some(x => x === id)) {
          return mem.layer;
        }
      }
      if (mem.layer.getDependLayers) {
        const dependLayers = mem.layer.getDependLayers() as WebMapLayerItem[];
        const dependFit = dependLayers.find(x => {
          return x.item && x.item.parentId === id;
        });
        if (dependFit) {
          return dependFit.layer;
        }
      }
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
  async zoomToLayer(layerDef: string | ResourceAdapter) {
    let id: string | undefined;
    if (typeof layerDef === 'string' || typeof layerDef === 'number') {
      id = String(id);
    } else {
      id = layerDef.id;
    }
    const ngwLayer = id && this._ngwLayers[id];
    if (ngwLayer) {
      if (ngwLayer.layer.getExtent) {
        const extent = await ngwLayer.layer.getExtent();
        if (extent) {
          this.fitBounds(extent);
        }
      } else {
        let item: ResourceItem;
        if (ngwLayer.layer.item) {
          item = ngwLayer.layer.item;
        } else {
          const resourceId = ngwLayer.resourceId;
          item = await this.connector.get('resource.item', null, {
            id: resourceId
          });
        }

        NgwKit.utils.getNgwResourceExtent(item, this.connector).then(extent => {
          if (extent) {
            this.fitBounds(extent);
          }
        });
      }
    }
  }

  onLoad(event: keyof NgwMapEvents = 'ngw-map:create'): Promise<this> {
    return super.onLoad(event as keyof WebMapEvents);
  }

  removeLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const layerId = this.getLayerId(layer);
      if (layerId) {
        delete this._ngwLayers[layerId];
      }
      super.removeLayer(layer);
    }
  }

  enableSelection() {
    if (!this.__selectFromNgwRaster) {
      this.__selectFromNgwRaster = (ev: MapClickEvent) =>
        this._selectFromNgwRaster(ev);
      this.__selectFromNgwVector = (ev: OnLayerClickOptions) =>
        this._selectFromNgwVector(ev);
      this.emitter.on('click', this.__selectFromNgwRaster);
      this.emitter.on('layer:click', this.__selectFromNgwVector);
    }
  }

  disableSelection() {
    if (this.__selectFromNgwRaster) {
      this.emitter.off('click', this.__selectFromNgwRaster);
      this.emitter.off('click', this._selectFromNgwVector);
      this.__selectFromNgwRaster = undefined;
      this.__selectFromNgwVector = undefined;
    }
  }

  private _isFitFromResource() {
    const params = this._initMapState;
    if (params.zoom && params.center) {
      return false;
    }
    return true;
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
        qmsId = Number(this.options.qmsId);
      }
      const qmsLayerOptions: QmsAdapterOptions = {
        qmsId
      };
      if (qmsLayerName) {
        qmsLayerOptions.id = qmsLayerName;
      }

      await this.addBaseLayer('QMS', qmsLayerOptions).then(layer => {
        this.showLayer(layer);
      });
    }

    const resources: NgwLayerOptions[] = [];
    const layerFitAllowed = this._isFitFromResource();
    if (this.options.webmapId) {
      appendNgwResources(resources, this.options.webmapId, {
        fit: layerFitAllowed
      });
    }
    if (this.options.resources && Array.isArray(this.options.resources)) {
      this.options.resources.forEach(x => {
        const overwriteOptions = {} as NgwLayerOptionsAdditional;
        if (!layerFitAllowed) {
          overwriteOptions.fit = false;
        }
        appendNgwResources(resources, x, {}, overwriteOptions);
      });
    }

    for (const r of resources) {
      await this.addNgwLayer(r);
    }

    this._emitStatusEvent('ngw-map:create', this);

    this.enableSelection();
  }

  private _addControls() {
    if (this.options.controls) {
      this.options.controls.forEach(x => {
        let controlAdapterName = x;
        let controlOptions: ControlOptions = {};
        if (typeof x === 'string' && this.options.controlsOptions) {
          if (this.options.controlsOptions[x]) {
            controlOptions = this.options.controlsOptions[x];
            if (controlOptions.control !== undefined) {
              controlAdapterName = controlOptions.control;
            }
          }
        }
        const { position, ...options } = controlOptions;
        this.addControl(controlAdapterName, position || 'top-left', options);
      });
    }
    this._emitStatusEvent('controls:create');
  }

  private async _selectFromNgwVector(
    ev: OnLayerClickOptions
  ): Promise<FeatureLayersIdentify | undefined> {
    const layer: ResourceAdapter = ev.layer as ResourceAdapter;
    // item property means layer is NgwResource
    const id = layer.item && layer.item.resource.id;
    const feature = ev.feature;

    if (id !== undefined && feature) {
      const featureId = feature.id;
      if (featureId) {
        const identifyFeature: LayerFeature = {
          id: Number(featureId),
          fields: feature.properties,
          label: `#${id}`,
          layerId: Number(id),
          parent: '',
          geom: feature.geometry
        };
        const items: FeatureLayersIdentifyItems = {
          featureCount: 1,
          features: [identifyFeature]
        };
        const identify: FeatureLayersIdentify = {
          featureCount: 1,
          [id]: items
        };
        this._emitStatusEvent('ngw:select', {
          ...identify,
          resources: [id],
          sourceType: 'vector'
        });
        return identify;
      }
    }
  }

  private async _selectFromNgwRaster(ev: MapClickEvent) {
    this._emitStatusEvent('ngw:preselect');

    const promises: Promise<number[] | undefined>[] = [];
    for (const nl in this._ngwLayers) {
      const layer = this._ngwLayers[nl].layer;
      if (layer.getIdentificationIds && layer.options.selectable) {
        promises.push(layer.getIdentificationIds());
      }
    }
    const getIds = await Promise.all(promises);
    const ids: number[] = [];
    getIds.forEach(x => {
      if (x) {
        x.forEach(y => ids.push(y));
      }
    });

    if (!ids.length) {
      this._emitStatusEvent('ngw:select', null);
      return;
    }

    const pixelRadius = this.options.pixelRadius || 10;
    const center = this.getCenter();
    const zoom = this.getZoom();
    if (!center || !zoom) {
      this._emitStatusEvent('ngw:select', null);
      return;
    }
    const metresPerPixel =
      (40075016.686 * Math.abs(Math.cos((center[1] * 180) / Math.PI))) /
      Math.pow(2, zoom + 8);
    // FIXME: understand the circle creation function
    const radius = pixelRadius * metresPerPixel * 0.0005;
    return NgwKit.utils
      .sendIdentifyRequest(ev, {
        layers: ids,
        connector: this.connector,
        radius
      })
      .then(resp => {
        this._emitStatusEvent('ngw:select', {
          ...resp,
          resources: ids,
          sourceType: 'raster',
          event: ev
        });
        return resp;
      });
  }
}
