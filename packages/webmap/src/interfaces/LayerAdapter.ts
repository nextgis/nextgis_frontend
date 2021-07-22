import type { GeoJsonObject, Feature } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { Paint } from '@nextgis/paint';
import type { Type } from '@nextgis/utils';
import type { LngLatBoundsArray } from './BaseTypes';
import type { MapClickEvent } from './MapAdapter';

export type AdapterConstructor = () => Promise<Type<LayerAdapter> | any>;

/**
 * @public
 */
export type LayerAdapterDefinition<K extends keyof LayerAdapters = string> =
  | K
  | Type<LayerAdapters[K]>
  | Promise<Type<LayerAdapters[K]> | undefined>;

export type OnLayerSelectType = 'api' | 'click' | 'hover';

/**
 * @public
 */
export interface OnLayerSelectOptions {
  layer: LayerAdapter;
  features?: Feature[] | undefined;
  type: OnLayerSelectType;
}

export type OnLayerMouseOptions = OnLayerClickOptions;

/**
 * @public
 */
export interface OnLayerClickOptions {
  layer: LayerAdapter;
  event: MapClickEvent;
  source: any;
  feature?: Feature;
  selected?: boolean;
}

/**
 * Parameters that can be used to create any map layer adapter.
 * @public
 */
export interface AdapterOptions<
  N extends Record<string, any> = Record<string, any>,
> {
  /**
   * Unique Layer ID.
   * If not specified, will be added automatically.
   *
   * @remarks
   * If the layer adapter is asynchronous, its id will be assigned only after the promise is resolved.
   * While adapter is loading, methods for obtaining layers will ignore the added layer.
   */
  id?: string;
  /**
   * Show layer on the map immediately after adding.
   * Such layers are always under others.
   * Only one base layer can be displayed on the map at a time.
   *
   * @defaultValue true
   */
  visibility?: boolean;
  /**
   * Indicate on a cartographic base layer.
   */
  baselayer?: boolean;
  /**
   * Indicates the map layers display sequence.
   * A layer with a larger order value overlaps smaller ones.
   * Zero value used to indicate baselayer.
   * If the value is not specified explicitly, it will be assigned automatically with an increase of one for each new layer.
   */
  order?: number;
  /**
   * String to be shown in the attribution control.
   * It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
   */
  attribution?: string;
  /**
   * Maximum zoom level of the map.
   */
  maxZoom?: number;
  /**
   * Minimum zoom level of the map.
   */
  minZoom?: number;
  /**
   * TODO: replace by minZoom
   * @internal
   * @deprecated use minZoom instead
   */
  minScale?: number;
  /**
   * TODO: replace by maxZoom
   * @internal
   * @deprecated use maxZoom instead
   */
  maxScale?: number;
  /**
   * Layer transparency.
   * From 0-transparent to 1-visible
   * @defaultValue 1
   */
  opacity?: number;
  /**
   * Fit map to layer extent
   * @defaultValue false
   */
  fit?: boolean;
  /**
   * Non-unique name of the layer. Can be used for user interfaces.
   */
  name?: string;
  adapter?: string;
  /**
   * Wait until the layer data is fully loaded before allowing added to the map.
   *
   * @remarks
   * If true, addLayer promise resolve only after data loading.
   * This is useful for GeoJson vector layer adapters when you need to process downloaded data before displaying.
   */
  waitFullLoad?: boolean;
  /**
   * Parameter added when forming a request for layer data.
   * This is needed if you want to access tile pixel data.
   * Refer to {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin | CORS Settings} for valid String values.
   */
  crossOrigin?: 'anonymous';

  headers?: Record<string, any>;

  /**
   * Experimental option to set the  map loading delay  when changing position
   */
  setViewDelay?: number;
  /** Any properties to save in layer.
   * May be useful to get additional info from layer event.
   */
  props?: Record<string, any>;
  /** Map and layer adapter base options */
  nativeOptions?: N;
  ratio?: number;
}

/**
 * @public
 */
export interface MvtAdapterOptions<F extends Feature = Feature>
  extends VectorAdapterOptions<F> {
  url: string;
  sourceLayer?: string;
}

/**
 * @public
 */
export type VectorAdapterLayerType = 'polygon' | 'point' | 'line';

export interface CreatePopupContentProps extends LayerDefinition {
  type: OnLayerSelectType;
}

/**
 * @public
 */
export interface PopupOptions {
  minWidth?: number;
  maxWidth?: number;
  autoPan?: boolean;
  popupContent?: string | HTMLElement;
  fromProperties?: boolean;
  createPopupContent?: (
    props: CreatePopupContentProps,
  ) =>
    | HTMLElement
    | string
    | undefined
    | Promise<HTMLElement | string | undefined>;
}

type _VectorAdapterOptionsToExtend<
  N extends Record<string, any> = Record<string, any>,
> = AdapterOptions<N> & FilterOptions;

/**
 * @public
 */
export interface VectorAdapterOptions<
  F extends Feature = Feature,
  L = any,
  N = Record<string, any>,
> extends _VectorAdapterOptionsToExtend<N> {
  /** Type for geometries painting, for each layer may be only one of: `point`, `polygon` or `line`. */
  type?: VectorAdapterLayerType;
  /**
   * Determine the appearance of the vector data geometries.
   *
   * @example
   * ```javascript
   * const circlePaint = { paint: { color: 'green', radius: 6 } };
   * const paintCb = (feature) => {
   *  return { color: 'red', opacity: feature.properties.opacity }
   * }
   * ```
   * @example
   * ```javascript
   * // Use global paint function
   * // set paint function inside WebMap static property
   * WebMap.getPaintFunctions.customPaintFunction = customIconPaintFunction
   *
   * webMap.addLayer('GEOJSON', {
   *   paint: {
   *     type: 'get-paint',
   *     from: 'customPaintFunction',
   *     options: {}
   *   }
   * }
   * ```
   */
  paint?: Paint;
  /**
   * The paint that applies to the features after it becomes selected.
   *
   * @example
   * ```javascript
   * webMap.addLayer('GEOJSON', {
   *   paint: { color: 'red' },
   *   selectedPaint: { color: 'green' }
   * });
   * ```
   */
  selectedPaint?: Paint;
  // selectedPaintDiff?: VectorAdapterLayerPaint;
  /**
   * Determines whether objects are selected by mouse click.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {
   *   paint: { color: 'red' },
   *   selectedPaint: { color: 'green' },
   *   selectable: false
   * });
   * // programmatically selection - ok, but not on mouse click
   * layer.select(({ feature }) => feature.properties.id === ID_FOR_SELECT);
   * ```
   */
  selectable?: boolean;
  interactive?: boolean;
  /**
   * Indicates whether several objects can be selected in one layer.
   *
   * @example
   * ```javascript
   * // multiselect: false
   * layer.select(({ feature }) => feature.properties.color === 'green'); // one feature will be selected
   * // multiselect: true
   * layer.select(({ feature }) => feature.properties.color === 'green'); // all 'green' features will be selected
   * ```
   */
  multiselect?: boolean;
  /**
   * Deselects layer feature by second click.
   */
  unselectOnSecondClick?: boolean;
  /**
   * Make the feature selected while mouseover.
   */
  selectOnHover?: boolean;
  popup?: boolean;
  popupOnSelect?: boolean;
  popupOptions?: PopupOptions;
  filter?: DataLayerFilter;
  propertiesFilter?: PropertiesFilter;
  featureIdName?: string;
  cluster?: boolean;
  /**
   * Max zoom to cluster points on
   */
  clusterMaxZoom?: number;
  /**
   * Radius of each cluster when clustering points
   * @defaultValue 50
   */
  clusterRadius?: number;
  labelOnHover?: boolean;
  labelField?: string;
  label?: (e: LayerDefinition<F, L>) => void | string;

  /**
   * @internal
   */
  source?: unknown;
  /**
   * @internal
   * @deprecated - TODO: move to nativeOptions
   */
  nativePaint?: boolean | Record<string, any>;
  /**
   * @internal
   * @deprecated - TODO: move to nativeOptions
   */
  nativeFilter?: unknown;
  /**
   * @internal
   * @deprecated - TODO: move to nativeOptions
   */
  layout?: any;
  /**
   * @internal
   * @deprecated - TODO: move to nativeOptions
   */
  selectedLayout?: any;

  onClick?(opt: OnLayerClickOptions): void;
  onSelect?(opt: OnLayerSelectOptions): void;

  /** Fired when the mouse enters the layer. */
  onMouseOver?(opt: OnLayerClickOptions): void;
  /** Fired when the mouse leaves the layer. */
  onMouseOut?(opt: OnLayerClickOptions): void;

  // @deprecated use {@link VectorAdapterOptions.onClick} instead
  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
  // @deprecated use {@link VectorAdapterOptions.onSelect} instead
  onLayerSelect?(opt: OnLayerSelectOptions): Promise<any>;
}

/**
 * @public
 */
export interface GeoJsonAdapterOptions<
  F extends Feature = Feature,
  L = any,
  N = Record<string, any>,
> extends VectorAdapterOptions<F, L, N> {
  /** Geojson data */
  data?: GeoJsonObject;
}

/**
 * @public
 */
export interface RasterAdapterOptions extends AdapterOptions {
  url: string;
  subdomains?: string | string[];
}

/**
 * @public
 */
export interface TileAdapterOptions extends RasterAdapterOptions {
  tileSize?: number;
}

/**
 * @public
 */
export interface Tileset3DAdapterOptions
  extends RasterAdapterOptions,
    VectorAdapterOptions {
  useTerrainHeight?: boolean;
  heightOffset?: number;
}

/**
 * @public
 */
export interface Model3DOptions extends RasterAdapterOptions {
  lon: number;
  lat: number;
  height?: number;
  rotate?: number;
  scale?: number;
}

/**
 * @public
 */
export interface WmsAdapterOptions extends RasterAdapterOptions {
  layers?: string;
  format?: 'image/png' | 'image/jpeg' | string;
  version?: string;
  tileSize?: number;
  updateWmsParams?: (obj: {
    [paramName: string]: any;
  }) => Record<string, unknown>;
  transparent?: boolean;
}

/**
 * @public
 */
export interface ImageAdapterOptions extends WmsAdapterOptions {
  /** @deprecated use `params` option instead */
  resourceId?: string | number;
  params: Record<string, any>;
}

/**
 * @public
 */
export interface LayerAdapters {
  [name: string]: MainLayerAdapter;
  MVT: VectorLayerAdapter;
  IMAGE: MainLayerAdapter<any, any, ImageAdapterOptions>;
  WMS: MainLayerAdapter<any, any, WmsAdapterOptions>;
  OSM: MainLayerAdapter;
  TILE: MainLayerAdapter<any, any, TileAdapterOptions>;
  GEOJSON: VectorLayerAdapter<any, any, GeoJsonAdapterOptions>;
}

/**
 * @public
 */
export interface LayerAdaptersOptions {
  [name: string]: AdapterOptions;
  MVT: MvtAdapterOptions;
  IMAGE: ImageAdapterOptions;
  WMS: WmsAdapterOptions;
  OSM: RasterAdapterOptions;
  TILE: TileAdapterOptions;
  GEOJSON: GeoJsonAdapterOptions;
}

/**
 * @public
 */
export interface LayerDefinition<F extends Feature = Feature, L = any> {
  layer?: L;
  feature?: F;
  visible?: boolean;
  target?: LayerAdapter;
}

/**
 * @public
 */
export type CallbackFilter<F extends Feature = Feature, L = any> = (
  opt: LayerDefinition<F, L>,
) => boolean;

/**
 * @public
 */
export interface FilterOptions<
  P extends { [field: string]: any } = { [field: string]: any },
> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  offset?: number;

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  limit?: number;
  fields?: (keyof P)[] | false | null;
  /** WKT polygon geometry */
  intersects?: string;
  strategy?: 'BBOX';
  /**
   * set fields for order
   *
   * @remarks
   * TODO: use typescript 4.1 template string type for map -`${field}`
   *
   * @example
   * ```javascript
   * { "orderBy": ["field1", "-field2"] }
   * ```
   */
  orderBy?: (keyof P | string)[];
}

/**
 * @public
 */
export type DataLayerFilter<
  F extends Feature = Feature,
  L = any,
> = CallbackFilter<F, L>;

/**
 * @public
 */
export type LayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions,
> = MainLayerAdapter<M, L, O> | VectorLayerAdapter<M, L, O>;

/**
 * @public
 */
export interface MainLayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions,
> {
  options: O;
  id?: string;
  order?: number;
  name?: string;
  layer?: L;
  map?: M;

  addLayer(options: O): L | Promise<L> | undefined;
  updateLayer?(): void;
  removeLayer?(): void;
  beforeRemove?(): void;

  showLayer?(layer?: L): void;
  hideLayer?(layer?: L): void;
  // TODO: always return Promise
  getExtent?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;

  // remove from this place
  getDependLayers?(): L[];
}

/**
 * Adapter for vector data display control.
 * @public
 */
export interface VectorLayerAdapter<
  M = any,
  L = any,
  O extends VectorAdapterOptions = VectorAdapterOptions,
  F extends Feature = Feature,
> extends MainLayerAdapter<M, L, O> {
  /** True if there are selected features in the layer  */
  selected?: boolean;

  /**
   * Experimental option, only for MVT. Points to a data source instead of loading data into a layer.
   */
  source?: unknown;
  /**
   * Allows to get all vector objects of the layer. Does not work for vector tiles.
   */
  getLayers?(): LayerDefinition<F, L>[];
  /**
   * Method for selecting objects on the map. The `selectedPaint` option will be applied to the selected objects.
   * @remarks
   * It is strongly recommended to use an `PtropertiesFilter` expression to set selected objects,
   * since the selecting by the callback function is not supported by vector tiles and other asynchronous adapters.
   */
  select?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  /**
   * Deselect all objects in the vector layer.
   *
   * @remarks
   * The parameter `findFeatureCb` is deprecated and will be deleted soon.
   * Instead, it’s better to deselect all and select again.
   */
  unselect?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  /**
   * Get the selected objects of the vector layer.
   */
  getSelected?(): LayerDefinition<Feature, L>[];
  /**
   * Get the filtered objects of the vector layer.
   */
  getFiltered?(): LayerDefinition<Feature, L>[];
  /**
   * Ability to filter a layer with a callback function.
   * It is necessary for the adapter to provide access to the layer objects before output to the map.
   * It is not possible to apply such a filter to vector tiles and data on the remote server.
   * So, where possible, use the {@link VectorLayerAdapter.propertiesFilter}.
   * @example
   * ```javascript
   * layer.filter((e) => e.feature.properties.id === 2011);
   * // but in this case it’s better to do so:
   * layer.propertiesFilter([['id', 'eq', 2011]])
   * ```
   */
  filter?(cb: DataLayerFilter<F, L>): Array<LayerDefinition<Feature, L>>;
  /**
   * The way to filter layer objects through serializable expressions.
   * To clear the filter, pass `null` or `undefined` as the second parameter.
   * @param filters - Filter, conforming to the PropertiesFilter expression specification's.
   * @param options - Options object.
   * @example
   * ```javascript
   * layer.propertiesFilter(['all', ['color', 'eq', 'green'], ['year', 'gt', 2011]]);
   * layer.propertiesFilter([[
   *   'any',
   *   ['color', 'eq', 'green'],
   *   ['color', 'eq', 'red']
   * ],
   *   ['year', 'gt', 2011]
   * ]);
   * ```
   */
  propertiesFilter?(filters: PropertiesFilter, options?: FilterOptions): void;
  /**
   * Cancel the filter, return all objects to the map.
   */
  removeFilter?(): void;
  /**
   * Add GeoJson data to layer.
   * @param geojson - GeoJson object.
   */
  addData?(geojson: GeoJsonObject): void | Promise<void>;
  /**
   * Update layer with new geojson.
   * @param geojson - GeoJson object.
   */
  setData?(geojson: GeoJsonObject): void | Promise<void>;
  /**
   * Remove layer data.
   * @param cb - Delete only those objects that match the filter.
   */
  clearLayer?(cb?: (feature: Feature) => boolean): void | Promise<void>;
  /**
   * Callback function that will be called when clicking on a layer.
   * @param event - Data that is transmitted when you click on a layer.
   * @internal
   */
  onLayerClick?(event: OnLayerClickOptions): Promise<any>;

  openPopup?(
    findFeatureCb?: DataLayerFilter<F, L>,
    options?: PopupOptions,
  ): void;

  closePopup?(findFeatureCb?: DataLayerFilter<F, L>): void;

  updateTooltip?(layerDef?: LayerDefinition<F, L>): void;
}
