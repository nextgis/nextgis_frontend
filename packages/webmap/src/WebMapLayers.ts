import { preparePaint } from '@nextgis/paint';
import { propertiesFilter } from '@nextgis/properties-filter';
import { defined } from '@nextgis/utils';

import { updateGeoJsonAdapterOptions } from './utils/updateGeoJsonAdapterOptions';
import { WebMapMain } from './WebMapMain';

import type { Paint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { FeatureProperties, TileJson, Type } from '@nextgis/utils';
import type { Feature, GeoJsonObject, Geometry } from 'geojson';

import type { LayerLegend } from '../../ngw-connector/src/types/LegendItem';

import type { LayerDef } from './interfaces/BaseTypes';
import type { WebMapEvents } from './interfaces/Events';
import type {
  AdapterConstructor,
  AdapterOptions,
  DataLayerFilter,
  FeatureLayerAdapter,
  FilterOptions,
  GeoJsonAdapterOptions,
  GetLegendOptions,
  ImageAdapterOptions,
  LayerAdapter,
  LayerAdapterDefinition,
  LayerAdapters,
  LayerAdaptersOptions,
  LayerDefinition,
  MainLayerAdapter,
  OnLayerMouseOptions,
  OnLayerSelectOptions,
  TileAdapterOptions,
  VectorLayerAdapter,
} from './interfaces/LayerAdapter';
import type { FitOptions } from './interfaces/MapAdapter';
import type {
  GetAttributionsOptions,
  MapOptions,
  ToggleLayerOptions,
} from './interfaces/MapOptions';

type AddedLayers<M = any, L = any> = { [id: string]: LayerAdapter<M, L> };

export class WebMapLayers<
  M = any,
  L = any,
  E extends WebMapEvents = WebMapEvents,
  O extends MapOptions = MapOptions,
> extends WebMapMain<M, E, O> {
  private _layersIdCounter = 1;
  private _layersOrderCounter = 1;
  private readonly _baselayers: string[] = [];
  private readonly _layers: AddedLayers<M, L> = {};
  private readonly _selectedLayers: string[] = [];

  constructor(mapOptions: O) {
    super(mapOptions);
    const tileJson = this.options.tileJson;
    if (tileJson) {
      this.emitter.once('build-map', () => this.addTileJsonLayer(tileJson));
    }
  }

  /**
   * Try to fit map view by given layer bounds.
   * But not all layers have borders
   */
  async fitLayer(layerDef: LayerDef, options?: FitOptions): Promise<void> {
    const layer = this.getLayer(layerDef);
    // TODO: remove backward compatibility for `getExtent`
    const getBounds = layer && (layer.getBounds || layer.getExtent);
    if (getBounds) {
      const extent = await getBounds.call(layer);
      if (extent) {
        this.fitBounds(extent, options);
      }
    }
  }

  /**
   * Check if given layer is baselayer
   */
  isBaseLayer(layerDef: LayerDef): boolean | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.id) {
      return this._baselayers.indexOf(layer.id) !== -1;
    }
    return undefined;
  }

  getBaseLayers(): LayerAdapter[] {
    const baselayers: LayerAdapter[] = [];
    this._baselayers.forEach((x) => {
      const baselayer = this._layers[x];
      if (baselayer) {
        baselayers.push(baselayer);
      }
    });
    return baselayers;
  }

  getBaseLayersIds(): string[] {
    return this._baselayers;
  }

  /**
   * Helper method to return added layer object by any definition type.
   */
  getLayer<LA extends LayerAdapter = LayerAdapter>(
    layerDef: LayerDef,
  ): LA | undefined {
    if (typeof layerDef === 'string') {
      return this._layers[layerDef] as LA;
    }
    return layerDef as LA;
  }

  /**
   * Helper method to return added layer identificator by any definition type.
   */
  getLayerId(layerDef: LayerDef): string | undefined {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (layer.id) {
        return layer?.id;
      }
      if (layer && layer.options) {
        return layer.options.id;
      }
    }
    throw new Error('No id for layer');
  }

  /**
   * Return array of all added layer identifications.
   */
  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  // TODO: rename to getLayers, getLayers rename to getLayersIds
  allLayers(): AddedLayers<M, L> {
    return this._layers;
  }

  orderedLayers<LA extends LayerAdapter<M, L> = LayerAdapter<M, L>>(): LA[] {
    return Object.values(this._layers).sort((a, b) =>
      a.order && b.order ? a.order - b.order : 0,
    ) as LA[];
  }

  findLayer<T extends LayerAdapter = LayerAdapter>(
    filter: (adapter: T) => boolean,
  ): T | undefined {
    for (const l in this._layers) {
      const layerAdapter = this._layers[l] as T;
      const isFit = filter(layerAdapter);
      if (isFit) {
        return layerAdapter;
      }
    }
  }

  /**
   * Check if the given layer on the map
   */
  isLayerVisible(layerDef: LayerDef): boolean {
    const layer = this.getLayer(layerDef);
    return layer && layer.options.visibility !== undefined
      ? layer.options.visibility
      : false;
  }

  /**
   * Shortcut method to create base layer
   */
  async addBaseLayer<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions,
  >(
    adapter: K | Type<LayerAdapters[K]>,
    options?: O | LayerAdaptersOptions[K],
  ): Promise<LayerAdapter> {
    const layer = await this.addLayer(
      adapter,
      {
        ...options,
        baselayer: true,
      },
      undefined,
    );

    return layer;
  }

  /**
   * Registration of map layer.
   *
   * @param adapter - The name of layer adapter from [MapAdapter.layerAdapters](webmap#MapAdapter.layerAdapters).
   *                May be custom object or class implemented by [MainLayerAdapter](webmap#MainLayerAdapter).
   * @param options - Specific options for given adapter
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', options).then((layer) => webMap.showLayer(layer));
   *
   * webMap.addLayer(CustomLayerAdapter, options);
   * ```
   */
  async addLayer<
    K extends keyof LayerAdapters,
    LO extends AdapterOptions = AdapterOptions,
  >(
    adapter: LayerAdapterDefinition<K>,
    options: LO | LayerAdaptersOptions[K] = {},
    order?: number,
  ): Promise<LayerAdapter> {
    const id = this._layersIdCounter++;
    const _order = defined(order)
      ? order
      : options.order !== undefined
        ? options.order
        : this.reserveOrder();
    let adapterEngine: Type<LayerAdapter<M, L, LO>> | undefined;
    if (typeof adapter === 'string') {
      adapterEngine = this.getLayerAdapter(adapter) as Type<
        LayerAdapter<M, L, LO>
      >;
    } else if (typeof adapter === 'function') {
      adapterEngine = adapter as Type<LayerAdapter<M, L, LO>>;
    } else if (
      'then' in (adapter as Promise<Type<LayerAdapters[K]> | undefined>)
    ) {
      adapterEngine = (await adapter) as Type<LayerAdapter<M, L, LO>>;
    }

    const geoJsonOptions = options as GeoJsonAdapterOptions;

    this._updateGeoJsonOptions(geoJsonOptions);

    options = {
      id: String(id),
      order: _order,
      ...options,
    };

    // options.visibility is a layer global state
    const visibility = options.visibility ?? true;
    options.visibility = false;

    if (options.baselayer) {
      options.order = 0;
    }
    if (this.options.onBeforeAddLayer) {
      const modified = this.options.onBeforeAddLayer({
        options,
        adapter: adapterEngine,
      });
      if (modified) {
        if (modified.options) {
          options = modified.options;
        }
        if (modified.adapter) {
          adapterEngine = modified.adapter as Type<LayerAdapter<M, L, LO>>;
        }
      }
    }
    if (adapterEngine !== undefined) {
      const _adapter = new adapterEngine(this.mapAdapter.map, options);
      _adapter.options = { ...options, ..._adapter.options };

      if (_adapter.options.baselayer) {
        options.baselayer = true;
        options.order = 0;
        _adapter.options.order = 0;
      }

      let layerId: string | undefined;
      if (_adapter.options.id) {
        layerId = String(_adapter.options.id);

        this._layers[layerId] = _adapter;
      }
      this._emitLayerEvent('layer:preadd', layerId || '', _adapter);
      await this.onMapLoad();
      _adapter.map = this.mapAdapter.map;
      const layer = await _adapter.addLayer(_adapter.options);
      // checking that the original layer was inserted into the adapter anyway
      _adapter.layer = layer;
      // think about how to move `id` to the adapter's constructor,
      // but that it is not required in the options
      _adapter.id = _adapter.options.id || String(id);
      _adapter.options.id = _adapter.id;
      if (options.baselayer) {
        _adapter.options.order = 0;
      }
      _adapter.order = _adapter.options.order ?? _order;
      if (layerId) {
        delete this._layers[layerId];
      }
      layerId = String(_adapter.id);
      if (this._layers[layerId]) {
        throw Error(`layer with id '${layerId}' already exist`);
      }
      if (layerId) {
        this._layers[layerId] = _adapter;

        if (geoJsonOptions.filter) {
          this.filterLayer(_adapter, geoJsonOptions.filter);
        }
        if (options.baselayer) {
          this._baselayers.push(layerId);
        }

        if (visibility) {
          await this.showLayer(layerId);
        }
      }
      const opacity = options.opacity;
      if (opacity !== undefined && opacity !== null && opacity <= 1) {
        this.setLayerOpacity(_adapter, opacity);
      }
      // TODO: remove backward compatibility for `getExtent`
      const getBounds = layer && (_adapter.getBounds || _adapter.getExtent);
      if (options.fit && getBounds) {
        const extent = await getBounds.call(_adapter);
        if (extent) {
          await this.fitBounds(extent);
        }
      }
      if (options.onAdded) {
        options.onAdded(_adapter);
      }
      this._emitLayerEvent('layer:add', layerId, _adapter);
      return _adapter;
    }
    return Promise.reject('No adapter');
  }

  async addLayerFromAsyncAdapter<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions,
  >(
    adapter: AdapterConstructor,
    options: O | LayerAdaptersOptions[K],
    order?: number,
  ): Promise<LayerAdapter> {
    const _order =
      order || options.order !== undefined
        ? options.order
        : this.reserveOrder();
    const adapterConstructor = adapter as AdapterConstructor;
    const adapterConstructorPromise = adapterConstructor();
    const adapterEngine = await adapterConstructorPromise;
    if (adapterEngine) {
      return this.addLayer(adapterEngine, options, _order);
    }
    return Promise.reject('No adapter');
  }

  /**
   * Remove all layer from map and memory.
   */
  removeLayers(
    allowCb?: (layer: string, adapter: LayerAdapter) => boolean,
  ): void {
    for (const l in this._layers) {
      let allow = true;
      if (allowCb) {
        allow = allowCb(l, this._layers[l]);
      }
      if (allow) {
        this.removeLayer(l);
        delete this._layers[l];
      }
    }
  }

  async getLegend(options?: GetLegendOptions): Promise<LayerLegend[]> {
    const promises: Promise<LayerLegend[]>[] = [];
    for (const l of this.orderedLayers()) {
      if (l.getLegend) {
        promises.push(l.getLegend(options));
      }
    }
    return (await Promise.all(promises)).flat();
  }

  reserveOrder(): number {
    return this._layersOrderCounter++;
  }

  /**
   * Remove all layers but not remove basemap.
   */
  removeOverlays(): void {
    this.removeLayers((layerId, layer) => {
      if (layer && layer.options && layer.options.baselayer) {
        return false;
      }
      return true;
    });
  }

  /**
   * Remove specific layer from map and memory by its definition.
   */
  removeLayer(layerDef: LayerDef): void {
    const layer = this.getLayer(layerDef);
    const layerId = layer && this.getLayerId(layer);
    if (layer && layerId) {
      this.emitter.emit('layer:preremove', layer);
      if (layer.beforeRemove) {
        layer.beforeRemove();
      }
      if (layer.removeLayer) {
        layer.removeLayer();
      } else {
        this.mapAdapter.removeLayer(layer.layer);
      }
      if (layer.options && layer.options.baselayer) {
        const index = this._baselayers.indexOf(layerId);
        if (index) {
          this._baselayers.splice(index, 1);
        }
      }
      delete this._layers[layerId];
      this.emitter.emit('layer:remove', layer);
    }
  }

  /**
   * Create layer from GeoJson data. Set style and behavior for selection.
   *
   * @example
   * ```javascript
   * // Add simple layer
   * webMap.addGeoJsonLayer({ data: geojson, paint: { color: 'red' } });
   *
   * // Add styled by feature property layer with selection behavior
   * webMap.addGeoJsonLayer({
   *   data: geojson,
   *   paint: function (feature) {
   *     return { color: feature.properties.color, opacity: 0.5 }
   *   },
   *  selectedPaint: function (feature) {
   *    return { color: feature.properties.selcolor, opacity: 1 }
   *  },
   *  selectable: true,
   *  multiselect: true
   * });
   *
   * // Add marker layer styled with use [Icons](icons)
   * webMap.addGeoJsonLayer({ data: geojson, paint: webMap.getIcon({ color: 'orange' })});
   *
   * // work with added layer
   * const layer = webMap.addGeoJsonLayer({ data: geojson, id: 'my_layer_name'});
   * // access layer by id
   * webMap.showLayer('my_layer_name');
   * // or access layer by instance
   * webMap.showLayer(layer);
   * ```
   */
  addGeoJsonLayer<
    K extends keyof LayerAdapters = keyof LayerAdapters,
    O extends GeoJsonAdapterOptions<any, any> = GeoJsonAdapterOptions,
  >(
    opt: O = {} as O,
    adapter?: LayerAdapterDefinition<K>,
  ): Promise<VectorLayerAdapter<any, any, any>> {
    opt = opt || ({} as O);
    opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
    opt.unselectOnSecondClick =
      opt.unselectOnSecondClick !== undefined
        ? opt.unselectOnSecondClick
        : true;
    if (!adapter) {
      opt = updateGeoJsonAdapterOptions(opt);
    }
    opt.paint = opt.paint || {};
    return this.addLayer(adapter || 'GEOJSON', opt);
  }

  /** Shortcut for {@link WebMapLayers.addGeoJsonLayer} to create GeoJson adapter with generic types for working in typescript */
  addFeatureLayer<
    P extends FeatureProperties = FeatureProperties,
    G extends Geometry = Geometry,
    O extends GeoJsonAdapterOptions<Feature<G, P>> = GeoJsonAdapterOptions<
      Feature<G, P>
    >,
  >(options = {} as O): Promise<FeatureLayerAdapter<P, G>> {
    return this.addGeoJsonLayer<'GEOJSON', O>(options) as Promise<
      FeatureLayerAdapter<P, G>
    >;
  }

  /** Shortcut for {@link WebMapLayers.addLayer} to create TileLayer adapter */
  addTileLayer(
    url: string,
    options: Omit<TileAdapterOptions, 'url'> = {},
  ): Promise<MainLayerAdapter<M, L, TileAdapterOptions>> {
    return this.addLayer('TILE', { ...options, url }) as Promise<
      MainLayerAdapter<M, L, TileAdapterOptions>
    >;
  }

  /** Shortcut for {@link WebMapLayers.addLayer} to create TileLayer adapter */
  addImageLayer(
    url: string,
    options: Omit<ImageAdapterOptions, 'url'>,
  ): Promise<MainLayerAdapter<M, L, ImageAdapterOptions>>;
  addImageLayer(
    options: ImageAdapterOptions,
  ): Promise<MainLayerAdapter<M, L, ImageAdapterOptions>>;
  addImageLayer(
    urlOrOptions: string | ImageAdapterOptions,
    options?: Omit<ImageAdapterOptions, 'url'>,
  ): Promise<MainLayerAdapter<M, L, ImageAdapterOptions>> {
    let url;
    if (typeof urlOrOptions === 'string') {
      url = urlOrOptions;
    } else {
      url = urlOrOptions.url;
      options = urlOrOptions;
    }

    return this.addLayer('IMAGE', { ...options, url }) as Promise<
      MainLayerAdapter<M, L, ImageAdapterOptions>
    >;
  }

  /**
   * Show added layer on the map by it definition.
   */
  showLayer(
    layerDef: LayerDef,
    options: ToggleLayerOptions = {},
  ): Promise<void> {
    return this.toggleLayer(layerDef, true, options);
  }

  /**
   * Hide added layer on the map by it definition.
   */
  hideLayer(
    layerDef: LayerDef,
    options: ToggleLayerOptions = {},
  ): Promise<void> {
    return this.toggleLayer(layerDef, false, options);
  }

  /**
   * Change added layer visibility on the map by given status or inverse current status.
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', {id: 'my_layer', url: ''}).then((layer) => {
   *   webMap.toggleLayer(layer, true);
   *   webMap.toggleLayer('my_layer', false);
   *   webMap.toggleLayer('my_layer');
   *   webMap.isLayerVisible(layer); // true
   * });
   * ```
   */
  toggleLayer(
    layerDef: LayerDef,
    status?: boolean,
    options: ToggleLayerOptions = {},
  ): Promise<void> {
    const layer = this.getLayer(layerDef);

    const onMap = layer && layer.options.visibility;
    const toStatus = status !== undefined ? status : !onMap;
    const silent = options.silent !== undefined ? options.silent : false;
    const action = async (l: LayerAdapter) => {
      const id = String(l.id);
      const preEventName = toStatus ? 'layer:preshow' : 'layer:prehide';
      const eventName = toStatus ? 'layer:show' : 'layer:hide';
      if (!silent) {
        this._emitLayerEvent(preEventName, id, l);
        this._emitLayerEvent('layer:pretoggle', id, l);
      }
      if (toStatus && this.mapAdapter) {
        const order = l.options.baselayer ? 0 : l.options.order;

        // do not show baselayer if another on the map
        if (l.options.baselayer && this._baselayers.length) {
          const anotherVisibleBaselayers = this._baselayers.filter((x) => {
            return x !== l.id && this.isLayerVisible(x);
          });
          for (const bl of anotherVisibleBaselayers) {
            await this.hideLayer(bl);
          }
        }
        if (l.showLayer) {
          await l.showLayer.call(l, l.layer);
        } else if (l.layer !== undefined) {
          await this.mapAdapter.showLayer(l.layer);
        }
        if (order !== undefined) {
          this.mapAdapter.setLayerOrder(l.layer, order, this._layers);
        }
      } else {
        if (l.hideLayer) {
          await l.hideLayer.call(l, l.layer);
        } else if (l.layer !== undefined) {
          await this.mapAdapter.hideLayer(l.layer);
        }
      }
      l.options.visibility = toStatus;
      if (!silent) {
        this._emitLayerEvent(eventName, id, l);
        this._emitLayerEvent('layer:toggle', id, l);
      }
    };
    if (layer) {
      return this.onMapLoad().then(() => action(layer));
    }
    return Promise.resolve();
  }

  updateLayer(
    layerDef: LayerDef,
    options?: { params?: Record<string, string> },
  ): Promise<void> {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (layer.updateLayer) {
        return Promise.resolve(layer.updateLayer(options));
      } else if (this.isLayerVisible(layer)) {
        return this.hideLayer(layer, { silent: true }).then(() => {
          return this.showLayer(layer, { silent: true });
        });
      }
    }
    return Promise.resolve();
  }

  /**
   * Set transparency for a given layer by number from 0 to 1
   */
  setLayerOpacity(layerDef: LayerDef, value: number): void {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (layer.setOpacity) {
        layer.setOpacity(value);
      } else if (this.mapAdapter.setLayerOpacity) {
        this.mapAdapter.setLayerOpacity(layer.layer, value);
      }
    }
  }

  isLayerLabelVisible(layerDef: LayerDef): boolean {
    const layer = this.getLayer(layerDef) as VectorLayerAdapter;
    if (layer.isLabelVisible) {
      return layer.isLabelVisible();
    }
    return layer.options.labelVisibility ?? true;
  }

  showLayerLabel(layerDef: LayerDef): void {
    this.toggleLayerLabel(layerDef, true);
  }

  hideLayerLabel(layerDef: LayerDef): void {
    this.toggleLayerLabel(layerDef, false);
  }

  toggleLayerLabel(layerDef: LayerDef, status?: boolean): boolean {
    const layer = this.getLayer(layerDef) as VectorLayerAdapter;
    status = status ?? !this.isLayerLabelVisible(layerDef);
    if (layer) {
      if (status) {
        if (layer.showLabel) {
          layer.options.labelVisibility = true;
          layer.showLabel();
        }
      } else {
        if (layer.hideLabel) {
          layer.options.labelVisibility = false;
          layer.hideLabel();
        }
      }
      if (layer.id) {
        this._emitLayerEvent('layer:label:toggle', layer.id, layer);
      }
    }
    return status;
  }

  /**
   * Mark the layer as selected.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be selected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.selectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```

   */
  selectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter): void {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer as VectorLayerAdapter;
      if (adapter && adapter.select) {
        adapter.select(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        this._selectedLayers.push(layerId);
      }
    }
  }

  /**
   * Unselect the given layer.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be unselected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.unSelectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   */
  unSelectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter): void {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer && (layer as VectorLayerAdapter);
      if (adapter.unselect) {
        adapter.unselect(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        const index = this._selectedLayers.indexOf(layerId);
        if (index !== -1) {
          this._selectedLayers.splice(index, 1);
        }
      }
    }
  }
  /** Remove selection from any selected selectable layer */
  unSelectLayers(): void {
    const layers = Object.values(this.allLayers());
    let l: VectorLayerAdapter;
    for (l of layers) {
      if (l.unselect) {
        l.unselect();
      }
    }
  }

  /**
   * Hide features from a vector layer using a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.filterLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   */
  filterLayer(
    layerDef: LayerDef,
    filter: DataLayerFilter<Feature, L>,
  ): LayerDefinition<Feature, L>[] {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.filter) {
      return adapter.filter(filter);
    }
    return [];
  }

  propertiesFilter(
    layerDef: LayerDef,
    filters: PropertiesFilter,
    options?: FilterOptions,
  ): Promise<void> {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer as VectorLayerAdapter;
      if (adapter.propertiesFilter) {
        return adapter.propertiesFilter(filters, options);
      } else if (adapter.filter) {
        this.filterLayer(adapter, (e) => {
          if (e.feature && e.feature.properties) {
            return propertiesFilter(e.feature.properties, filters);
          }
          return true;
        });
      }
    }
    return Promise.resolve();
  }

  removeLayerFilter(layerDef: LayerDef): void {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.removeFilter) {
      adapter.removeFilter();
    } else if (adapter.filter) {
      adapter.filter(() => {
        return true;
      });
    }
  }

  /**
   * Sets the GeoJSON data for given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON').then((layer) => {
   *   webMap.setLayerData(layer, geojson);
   * });
   * ```
   */
  setLayerData(layerDef: LayerDef, data: GeoJsonObject): void | Promise<void> {
    const vectorAdapter = this.getLayer(layerDef);
    const adapter = vectorAdapter as VectorLayerAdapter;
    if (adapter) {
      if (adapter.setData) {
        return adapter.setData(data);
      } else if (adapter.clearLayer && adapter.addData) {
        adapter.clearLayer();
        return adapter.addData(data);
      }
    }
    return Promise.resolve();
  }

  /**
   * Push new the GeoJSON features into given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson_features_5}).then((layer) => {
   *   console.log(layer.getLayers().length) // > 5;
   *   webMap.addLayerData(layer, geojson_features_3);
   *   console.log(layer.getLayers().length) // > 8;
   * });
   * ```
   */
  addLayerData(layerDef: LayerDef, data: GeoJsonObject): void {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.addData) {
      adapter.addData(data);
    }
  }

  /**
   * Remove from vector layer all features.
   * it is possible to remove only some objects if you specify a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.clearLayerData(layer, (feture) => feture.id === 42);
   *   webMap.clearLayerData(layer);
   * });
   * ```
   */
  clearLayerData(layerDef: LayerDef, cb?: (feature: Feature) => boolean): void {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter && adapter.clearLayer) {
      adapter.clearLayer(cb);
    }
  }

  setLayerPaint(layerDef: LayerDef, paint?: Paint | null): void {
    const layer = this.getLayer(layerDef);
    if (paint && layer && layer.setPaint) {
      layer.setPaint(paint);
    }
  }
  setLayerSelectedPaint(layerDef: LayerDef, paint?: Paint | null): void {
    const layer = this.getLayer(layerDef);
    if (paint && layer && layer.setSelectedPaint) {
      layer.setSelectedPaint(paint);
    }
  }
  updateLayerPaint(layerDef: LayerDef, paint: Partial<Paint>): void {
    const layer = this.getLayer(layerDef);
    if (paint && layer && layer.updatePaint) {
      layer.updatePaint(paint);
    }
  }
  updateLayerSelectedPaint(layerDef: LayerDef, paint: Partial<Paint>): void {
    const layer = this.getLayer(layerDef);
    if (paint && layer && layer.updateSelectedPaint) {
      layer.updateSelectedPaint(paint);
    }
  }

  getAttributions(options: GetAttributionsOptions): string[] {
    const attributions: string[] = [];
    for (const l in this._layers) {
      const layerCache = this._layers[l];
      const onlyVisible =
        options.onlyVisible !== undefined ? options.onlyVisible : true;
      let useLayerAttr = onlyVisible ? layerCache.options.visibility : true;
      if (useLayerAttr && options.onlyBaselayer) {
        useLayerAttr = this._baselayers.includes(l);
      }
      if (useLayerAttr) {
        const attr = layerCache.options && layerCache.options.attribution;
        if (attr) {
          attributions.push(attr);
        }
      }
    }

    return attributions;
  }

  getActiveBaseLayer(): MainLayerAdapter<M, any, AdapterOptions> | undefined {
    const visibleLayerBaseLayer = this.getBaseLayers().find((x) => {
      return this.isLayerVisible(x);
    });
    if (visibleLayerBaseLayer) {
      return this.getLayer(visibleLayerBaseLayer);
    }
  }

  addTileJsonLayer(
    tileJson: TileJson,
  ): Promise<MainLayerAdapter<M, any, TileAdapterOptions>> {
    // if (this.mapAdapter.createTileJsonlayer) {
    // } else {

    const url = tileJson.tiles[0];
    return this.addLayer('TILE', {
      url,
      maxZoom: tileJson.maxzoom,
      minZoom: tileJson.minzoom,
      subdomains: tileJson.scheme,
      attribution: tileJson.attribution,
    }) as Promise<MainLayerAdapter<M, any, TileAdapterOptions>>;
  }

  /** @internal */
  _emitLayerEvent(name: keyof E, id: string, options?: unknown) {
    const name_ = String(name);
    if (defined(id) && name_.startsWith('layer:')) {
      const specificLayerName = name_.replace('layer:', 'layer-' + id + ':');
      this.emitter.emit(specificLayerName as keyof WebMapEvents, options);
    }
    this.emitter.emit(name as keyof WebMapEvents, options);
  }

  private async _onLayerClick(options: OnLayerMouseOptions) {
    const id = options.layer.id;
    this._emitLayerEvent('layer:click', id || '', options);
    return Promise.resolve(options);
  }
  private async _onLayerDoubleClick(options: OnLayerMouseOptions) {
    const id = options.layer.id;
    this._emitLayerEvent('layer:dblclick', id || '', options);
    return Promise.resolve(options);
  }

  private async _onLayerSelect(options: OnLayerSelectOptions) {
    this._emitLayerEvent('layer:select', options.layer.id || '', options);
    return Promise.resolve(options);
  }

  private _updateGeoJsonOptions(options: GeoJsonAdapterOptions) {
    const {
      onSelect,
      onLayerSelect,
      onClick,
      onDoubleClick,
      onLayerClick,
      onMouseOut,
      onMouseOver,
    } = options;
    const onLayerClickFromOpt = onClick || onLayerClick;
    const onLayerDblClickFromOpt = onDoubleClick || onLayerClick;
    options.onClick = (e) => {
      if (onLayerClickFromOpt) {
        onLayerClickFromOpt(e);
      }
      return this._onLayerClick(e);
    };
    options.onDoubleClick = (e) => {
      if (onLayerDblClickFromOpt) {
        onLayerDblClickFromOpt(e);
      }
      return this._onLayerDoubleClick(e);
    };

    options.onMouseOut = (e) => {
      const id = e.layer.id;
      if (onMouseOut) onMouseOut(e);
      if (defined(id)) {
        this._emitLayerEvent(`layer:mouseout`, id, e);
      }
    };

    options.onMouseOver = (e) => {
      const id = e.layer.id;
      if (onMouseOver) onMouseOver(e);
      if (defined(id)) {
        this._emitLayerEvent(`layer:mouseover`, id, e);
      }
    };

    // TODO: remove backward compatibility for onLayerSelect
    const onLayerSelectFromOpt = onSelect || onLayerSelect;
    options.onSelect = (e) => {
      if (onLayerSelectFromOpt) {
        onLayerSelectFromOpt(e);
      }
      return this._onLayerSelect(e);
    };

    if (!options.nativePaint) {
      if (this.options.paint) {
        options.paint = preparePaint({
          paint: options.paint || {},
          defaultPaint: this.options.paint,
          getPaintFunctions: this.getPaintFunctions,
        });
      }
      if (options.selectedPaint && this.options.selectedPaint) {
        options.selectedPaint = preparePaint({
          paint: options.selectedPaint,
          defaultPaint: this.options.selectedPaint,
          getPaintFunctions: this.getPaintFunctions,
        });
      }
    }
  }
}
