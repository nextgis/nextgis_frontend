import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import CancelablePromise from '@nextgis/cancelable-promise';
import { defined, isObject } from '@nextgis/utils';
import { AdapterOptions, WebMap } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';

import {
  addNgwLayer,
  fetchNgwLayerItem,
  fetchNgwLayerItems,
  fetchNgwLayerFeature,
  fetchNgwLayerFeatureCollection,
  fetchIdentifyGeoJson,
  fetchNgwResourceExtent,
  sendIdentifyRequest,
  getCompanyLogo,
  fetchIdentifyItem,
  getIdentifyItems,
  createIdentifyItem,
  NgwLayerAdapterType,
} from '@nextgis/ngw-kit';
import { deprecatedWarn } from '@nextgis/utils';
import { getIcon } from '@nextgis/icons';

import { appendNgwResources } from './utils/appendNgwResources';
import { prepareWebMapOptions } from './utils/prepareWebMapOptions';

import type { JsonMap, FeatureProperties } from '@nextgis/utils';
import type {
  FeatureItem,
  LayerFeature,
  ResourceItem,
  FeatureLayersIdentify,
  FeatureLayersIdentifyItems,
} from '@nextgis/ngw-connector';
import type {
  OnLayerClickOptions,
  ControlPosition,
  FilterOptions,
  MapClickEvent,
  LayerAdapter,
  WebMapEvents,
  MapControls,
  FitOptions,
  LayerDef,
} from '@nextgis/webmap';
import type {
  NgwIdentify,
  NgwWebmapItem,
  ResourceAdapter,
  FetchNgwItemsOptions,
  NgwFeatureItemResponse,
  NgwFeatureRequestOptions,
} from '@nextgis/ngw-kit';
import type { Geometry, Feature, FeatureCollection } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { QmsAdapterOptions } from '@nextgis/qms-kit';
import type { NgwLayerOptions } from '@nextgis/ngw-kit';
import type { NgwMapOptions, NgwMapEvents, NgwLayers } from './interfaces';
import type { FetchNgwItemOptions } from '@nextgis/ngw-kit';

type PromiseGroup = 'select' | 'identify';

/**
 * Base class containing the logic of interaction WebMap with NextGIS services.
 *
 * @example
 * ```javascript
 * import { NgwMap } from '@nextgis/ngw-map';
 * import MapAdapter from '@nextgis/leaflet-map-adapter';
 * // styles are not included in the leaflet-map-adapter
 * import 'leaflet/dist/leaflet.css';
 *
 * const ngwMap = new NgwMap({
 *   mapAdapter: new MapAdapter(),
 *   target: 'map',
 *   qmsId: 448,
 *   baseUrl: 'https://demo.nextgis.com',
 *   webmapId: 3985
 * });
 * ```
 * @public
 */
export class NgwMap<
  M = unknown,
  L = unknown,
  C = unknown,
  O extends NgwMapOptions<C> = NgwMapOptions<C>,
> extends WebMap<M, L, C, NgwMapEvents, O> {
  static getIcon = getIcon;

  readonly emitter: StrictEventEmitter<EventEmitter, NgwMapEvents> =
    new EventEmitter();
  connector!: NgwConnector;

  protected _ngwLayers: NgwLayers = {};
  private $$selectFromNgwRaster?: (ev: MapClickEvent) => void;
  private $$selectFromNgwVector?: (ev: OnLayerClickOptions) => void;
  private _promises: Record<PromiseGroup, CancelablePromise[]> = {
    select: [],
    identify: [],
  };

  constructor(options: O) {
    super(prepareWebMapOptions(options) as O);
    if (options.connector) {
      this.connector = options.connector;
    }
    this._createWebMap().then(() => {
      const container = this.getContainer();
      if (container) {
        container.classList.add('ngw-map-container');
      }
      if (this.options.whitlabel) {
        this._whiteLabel();
      }
    });
  }

  /**
   * Organized addition to the map design and controls elements,
   * calling `control.onAdd(this.webMap.mapAdapter)`
   * @param control - object with onAdd and onRemove methods
   *                or a string value indicating the name of the control installed in the map adapter
   * @param position - position relative to the map angles
   * @param options - initialization parameters if the control is set as a string value
   *
   * @example
   * ```javascript
   * ngwMap.addControl(new CustomControl(), 'bottom-left');
   * ngwMap.addControl('ZOOM', 'top-right')
   * ```
   */
  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPosition,
    options?: MapControls[K],
  ): Promise<any> {
    await this.onLoad('controls:create');
    return super.addControl(controlDef, position, options);
  }

  /**
   * Add any (style, vector, webmap) NGW layer by resource definition.
   * @param options - set layer identification parameters and render method.
   *
   * @example
   * ```javascript
   * // add raster layer resourceId is the style of 4004 layer
   * ngwMap.addNgwLayer({ resource: 4005 });
   * // add vector data from layer GEOJSON source
   * ngwMap.addNgwLayer({
   *   resource: 4038,
   *   adapter: 'GEOJSON',
   *   adapterOptions: { paint: { color: 'red' } }
   * });
   * ```
   */
  async addNgwLayer<
    T extends NgwLayerAdapterType = NgwLayerAdapterType,
    P = FeatureProperties,
  >(options: NgwLayerOptions<T, P>): Promise<ResourceAdapter | undefined> {
    await this.onMapLoad();
    // @ts-ignore for backward compatibility
    const { keyname, resourceId } = options;

    if (keyname || resourceId !== undefined) {
      deprecatedWarn(
        'set `resource` options instead of `keyname` or `resourceId`',
      );
    }

    const resource = options.resource;
    if (!keyname && !resourceId && !resource) {
      throw new Error(
        'resource, resourceId or keyname is required parameter to add NGW layer',
      );
    }
    if (defined(this.options.baseUrl)) {
      try {
        if (defined(this.options.setViewDelay)) {
          options.adapterOptions = options.adapterOptions || {};
          if (!defined(options.adapterOptions.setViewDelay)) {
            options.adapterOptions.setViewDelay = this.options.setViewDelay;
          }
        }
        const adapter = addNgwLayer(options, this, this.connector);
        const adapterOpts = {
          visibility: true,
          // TODO: do not merge options, use only `adapterOptions`
          ...options,
          ...options.adapterOptions,
        } as AdapterOptions;
        const layer = (await this.addLayer(
          adapter,
          adapterOpts,
        )) as ResourceAdapter<M, L, AdapterOptions>;
        const id = layer && this.getLayerId(layer);
        if (layer && id) {
          this._ngwLayers[id] = { layer, resourceId: layer.resourceId };

          if (layer.options.baselayer) {
            const visibleLayerBaseLayer = this.getActiveBaseLayer();
            if (visibleLayerBaseLayer) {
              return layer;
            }
          }
        }
        return layer;
      } catch (er) {
        const resId =
          isObject(resource) && 'id' in resource
            ? resource.id
            : keyname || resourceId || resource;
        console.error(`Can't add NGW layer ${resId}.`, er);
      }
    }
  }

  /**
   * Pans and zooms the map to the initial position specified in the options
   */
  fit(): void {
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

  fetchNgwLayerItem<
    G extends Geometry = Geometry,
    P extends FeatureProperties = FeatureProperties,
  >(
    options: Omit<FetchNgwItemOptions<P>, 'connector'>,
  ): CancelablePromise<FeatureItem> {
    return fetchNgwLayerItem<G, P>({
      connector: this.connector,
      ...options,
    });
  }

  fetchNgwLayerItems<
    F extends FeatureProperties = FeatureProperties,
    G extends Geometry = Geometry,
  >(
    options: Omit<FetchNgwItemsOptions<F>, 'connector'>,
  ): CancelablePromise<FeatureItem<F, G>[]> {
    return fetchNgwLayerItems<G, F>({
      connector: this.connector,
      ...options,
    });
  }

  fetchNgwLayerFeature<
    G extends Geometry = Geometry,
    P extends FeatureProperties = FeatureProperties,
  >(
    options: Omit<FetchNgwItemOptions<P>, 'connector'>,
  ): CancelablePromise<Feature<G, P>> {
    return fetchNgwLayerFeature<G, P>({
      connector: this.connector,
      ...options,
    });
  }

  fetchNgwLayerFeatures<
    G extends Geometry | null = Geometry,
    P extends FeatureProperties = FeatureProperties,
  >(
    options: Omit<FetchNgwItemsOptions<P>, 'connector'>,
  ): CancelablePromise<FeatureCollection<G, P>> {
    return fetchNgwLayerFeatureCollection({
      connector: this.connector,
      ...options,
    });
  }

  fetchIdentifyItem<
    G extends Geometry = Geometry,
    P extends FeatureProperties = FeatureProperties,
  >(
    identify: NgwIdentify,
    requestOptions?: NgwFeatureRequestOptions,
    // multiple = false
  ): CancelablePromise<NgwFeatureItemResponse<P, G> | undefined> {
    const promise = fetchIdentifyItem<G, P>({
      identify,
      connector: this.connector,
      requestOptions,
      // multiple,
    });

    this._addPromise('identify', promise);
    return promise;
  }

  fetchIdentifyGeoJson(
    identify: NgwIdentify,
    multiple = false,
  ): CancelablePromise<Feature | undefined> {
    const promise = fetchIdentifyGeoJson({
      identify,
      connector: this.connector,
      multiple,
    });
    if (promise && 'then' in promise) {
      this._addPromise('identify', promise);
      return promise;
    } else {
      return CancelablePromise.resolve(promise);
    }
  }

  /**
   * @deprecated use {@link fetchIdentifyGeoJson} instead
   */
  getIdentifyGeoJson(
    identify: NgwIdentify,
    multiple = false,
  ): CancelablePromise<Feature | undefined> {
    return this.fetchIdentifyGeoJson(identify, multiple);
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
        if (ids && ids.some((x) => x === id)) {
          return mem.layer;
        }
      }
      if (mem.layer.getDependLayers) {
        const dependLayers = mem.layer.getDependLayers() as NgwWebmapItem[];
        const dependFit = dependLayers.find((x) => {
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
   *
   * @example
   * ```javascript
   * const ngwLayer = ngwMap.addNgwLayer({ id: 'ngw_layer_name', resourceId: 4005 });
   * ngwMap.fitLayer(ngwLayer);
   * ngwMap.fitLayer('ngw_layer_name');
   * ```
   */
  async fitLayer(layerDef: LayerDef, options?: FitOptions): Promise<void> {
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
          this.fitBounds(extent, options);
        }
      } else {
        let item: ResourceItem | undefined;
        if (ngwLayer.layer.item) {
          item = ngwLayer.layer.item;
        } else {
          const resourceId = ngwLayer.resourceId;
          item = await this.connector.getResource(resourceId);
        }
        if (item) {
          fetchNgwResourceExtent(item, this.connector).then((extent) => {
            if (extent) {
              this.fitBounds(extent, options);
            }
          });
        }
      }
    } else {
      super.fitLayer(layerDef, options);
    }
  }

  /** @deprecated use {@link NgwMap.fitLayer} instead */
  async zoomToLayer(layerDef: string | ResourceAdapter): Promise<void> {
    return this.fitLayer(layerDef);
  }

  onLoad(event: keyof NgwMapEvents = 'ngw-map:create'): Promise<this> {
    return super.onLoad(event as keyof WebMapEvents);
  }

  removeLayer(layerDef: LayerDef): void {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const layerId = this.getLayerId(layer);
      if (layerId) {
        delete this._ngwLayers[layerId];
      }
      super.removeLayer(layer);
    }
  }

  enableSelection(): void {
    if (!this.$$selectFromNgwRaster) {
      this.$$selectFromNgwRaster = (ev: MapClickEvent) => {
        const count = this.emitter.listenerCount('ngw:select');
        if (count) {
          this._selectFromNgwRaster(ev);
        }
      };
      this.$$selectFromNgwVector = (ev: OnLayerClickOptions) => {
        if (this.emitter.listenerCount('ngw:select')) {
          this._selectFromNgwVector(ev);
        }
      };
      this.emitter.on('click', this.$$selectFromNgwRaster);
      this.emitter.on('layer:click', this.$$selectFromNgwVector);
    }
  }

  disableSelection(): void {
    if (this.$$selectFromNgwRaster) {
      this.emitter.removeListener('click', this.$$selectFromNgwRaster);
      this.emitter.removeListener('click', this._selectFromNgwVector);
      this.$$selectFromNgwRaster = undefined;
      this.$$selectFromNgwVector = undefined;
    }
  }

  /**
   * @deprecated use {@link NgwMap.fetchNgwLayerItem} instead
   */
  getNgwLayerItem(options: {
    resourceId: number;
    featureId: number;
  }): CancelablePromise<FeatureItem> {
    return this.fetchNgwLayerItem(options);
  }

  /**
   * @deprecated use {@link NgwMap.fetchNgwLayerItems} instead
   */
  getNgwLayerItems(
    options: {
      resourceId: number;
      connector?: NgwConnector;
      filters?: PropertiesFilter;
    } & FilterOptions,
  ): CancelablePromise<FeatureItem[]> {
    return this.fetchNgwLayerItems(options);
  }

  /**
   * @deprecated use {@link NgwMap.fetchNgwLayerFeature} instead
   */
  getNgwLayerFeature<
    G extends Geometry = Geometry,
    P extends JsonMap = JsonMap,
  >(options: {
    resourceId: number;
    featureId: number;
  }): CancelablePromise<Feature<G, P>> {
    return this.fetchNgwLayerFeature(options);
  }

  /**
   * @deprecated use {@link NgwMap.fetchNgwLayerFeatures} instead
   */
  getNgwLayerFeatures<
    G extends Geometry | null = Geometry,
    P extends JsonMap = JsonMap,
  >(
    options: FetchNgwItemsOptions<P>,
  ): CancelablePromise<FeatureCollection<G, P>> {
    return this.fetchNgwLayerFeatures(options);
  }

  /** @deprecated use {@link NgwMap.cancelPromises} instead */
  cancelPromise(...args: PromiseGroup[]): void {
    this.cancelPromises(...args);
  }

  cancelPromises(...args: PromiseGroup[]): void {
    if (!args.length) {
      args = Object.keys(this._promises) as PromiseGroup[];
    }
    args.forEach((name) => {
      const group = this._promises[name];
      if (group) {
        group.forEach((x) => x.cancel());
        this._promises[name] = [];
      }
    });
  }

  private _addPromise(groupName: PromiseGroup, promise: CancelablePromise) {
    const group = this._promises[groupName];
    if (group && group.indexOf(promise) === -1) {
      const removeFromGroup = () => {
        const index = group.indexOf(promise);
        if (index !== -1) {
          group.splice(index, 1);
        }
      };
      promise.then(removeFromGroup);
      promise.catch(removeFromGroup);
      group.push(promise);
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
    await this.create();
    if (this.options.qmsId) {
      this.addQmsBaseLayer();
    }
    if (this.options.osm) {
      this.addOsmBaseLayer();
    }

    const resources: NgwLayerOptions[] = [];
    const layerFitAllowed = this._isFitFromResource();
    if (this.options.webmapId) {
      appendNgwResources(resources, this.options.webmapId, {
        fit: layerFitAllowed,
      });
    }
    if (this.options.resources && Array.isArray(this.options.resources)) {
      this.options.resources.forEach((x) => {
        const overwriteOptions: Partial<NgwLayerOptions> = {};
        if (!layerFitAllowed) {
          overwriteOptions.fit = false;
        }
        appendNgwResources(resources, x, {}, overwriteOptions);
      });
    }
    for (const r of resources) {
      try {
        await this.addNgwLayer(r);
      } catch (er) {
        console.log(er);
      }
    }
    this._emitStatusEvent('ngw-map:create', this);
    this.enableSelection();
  }

  private addOsmBaseLayer() {
    this.addBaseLayer('OSM');
  }

  private addQmsBaseLayer() {
    let qmsId: number;
    let qmsLayerName: string | undefined;
    if (Array.isArray(this.options.qmsId)) {
      qmsId = this.options.qmsId[0];
      qmsLayerName = this.options.qmsId[1];
    } else {
      qmsId = Number(this.options.qmsId);
    }
    const qmsLayerOptions: Partial<QmsAdapterOptions> = {
      qmsId,
    };
    if (qmsLayerName) {
      qmsLayerOptions.id = qmsLayerName;
    }

    this.addBaseLayer('QMS', qmsLayerOptions);
  }

  private _selectFromNgwVector(
    ev: OnLayerClickOptions,
  ): FeatureLayersIdentify | undefined {
    const layer: ResourceAdapter = ev.layer as ResourceAdapter;
    // item property means layer is NgwResource
    const id = layer.item && layer.item.resource.id;
    const feature = ev.feature;

    if (id !== undefined && feature) {
      const featureId = feature.id;
      if (featureId) {
        const identifyFeature: LayerFeature = {
          id: Number(featureId),
          fields: feature.properties || {},
          label: `#${id}`,
          layerId: Number(id),
          parent: '',
          geom: feature.geometry,
        };
        const items: FeatureLayersIdentifyItems = {
          featureCount: 1,
          features: [identifyFeature],
        };
        const identify: FeatureLayersIdentify = {
          featureCount: 1,
          [id]: items,
        };
        this._emitStatusEvent(
          'ngw:select',
          this._prepareToIdentify({
            ...identify,
            resources: [id],
            sourceType: 'vector',
          } as NgwIdentify),
        );
        return identify;
      }
    }
  }

  private async _selectFromNgwRaster(ev: MapClickEvent) {
    this._emitStatusEvent('ngw:preselect');

    const promises: Promise<number[] | undefined>[] = [];
    const layers = Object.values(this._ngwLayers);
    layers.sort((a, b) => {
      if (a.layer.order && b.layer.order) {
        return b.layer.order - a.layer.order;
      }
      return 1;
    });
    layers.forEach((l) => {
      const layer = l.layer;
      const identFunc =
        typeof layer.getIdentificationIds === 'function'
          ? layer.getIdentificationIds
          : false;
      if (identFunc && layer.options.selectable && this.isLayerVisible(layer)) {
        promises.push(identFunc.call(layer));
      }
    });
    const getIdsPromise = Promise.all(promises);
    const getIds = await getIdsPromise;
    const ids: number[] = [];
    getIds.forEach((x) => {
      if (x) {
        x.forEach((y) => ids.push(y));
      }
    });

    if (!ids.length) {
      this._emitStatusEvent('ngw:select', null);
      return;
    }

    const pixelRadius = this.options.pixelRadius || 10;
    const center = this.getCenter();
    let zoom = this.getZoom();
    zoom = zoom !== undefined ? zoom : 20;
    if (!center || !zoom) {
      this._emitStatusEvent('ngw:select', null);
      return;
    }
    const metresPerPixel =
      (40075016.686 * Math.abs(Math.cos((center[1] * 180) / Math.PI))) /
      Math.pow(2, zoom + 8);
    const radius = pixelRadius * metresPerPixel * 0.0005;

    const selectPromise = sendIdentifyRequest(ev, {
      layers: ids,
      connector: this.connector,
      radius,
    }).then((resp) => {
      this._emitStatusEvent(
        'ngw:select',
        this._prepareToIdentify({
          ...resp,
          resources: ids,
          sourceType: 'raster',
          event: ev,
        }),
      );
      return resp;
    });
    this._addPromise('select', selectPromise);
    return selectPromise;
  }

  private _prepareToIdentify(identify: NgwIdentify) {
    const getIdentifyItems_ = () => {
      return getIdentifyItems(identify, true).map((x) => {
        return createIdentifyItem({
          feature: x.feature,
          connector: this.connector,
        });
      });
    };
    return {
      ...identify,
      getIdentifyItems: getIdentifyItems_,
    };
  }

  private async _whiteLabel() {
    const container = this.getContainer();
    if (container) {
      const logo = await getCompanyLogo(
        this.connector,
        this.options.companyLogoOptions,
      );
      if (logo) {
        container.appendChild(logo);
      }
    }
  }
}
