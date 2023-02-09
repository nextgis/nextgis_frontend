import type { GeoJsonObject, Feature, Geometry } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { Paint } from '@nextgis/paint';
import type {
  LngLatBoundsArray,
  FeatureProperties,
  LngLatArray,
  Type,
  ExtractFeatureProperties,
} from '@nextgis/utils';
import type { MapClickEvent } from './MapAdapter';

export type AdapterConstructor = () => Promise<Type<LayerAdapter> | any>;

export type LayerAdapterDefinition<K extends keyof LayerAdapters = string> =
  | K
  | Type<LayerAdapters[K]>
  | Promise<Type<LayerAdapters[K]> | undefined>;

export type OnLayerSelectType = 'api' | 'click' | 'hover';

export interface OnLayerSelectOptions<
  F extends Feature = Feature,
  L = LayerAdapter,
> extends FeaturePosition {
  layer: L;
  features?: F[] | undefined;
  type: OnLayerSelectType;
}

/** @deprecated use {@link OnLayerMouseOptions} instead */
export type OnLayerClickOptions<
  F extends Feature = Feature,
  L = LayerAdapter,
> = OnLayerMouseOptions<F, L>;

export interface OnLayerMouseOptions<
  F extends Feature = Feature,
  L = LayerAdapter,
> extends FeaturePosition {
  layer: L;
  event: MapClickEvent;
  source: any;
  feature?: F;
  selected?: boolean;
}

/**
 * Parameters that can be used to create any map layer adapter.
 */
export interface AdapterOptions<
  ANYPROPS extends Record<string, any> = Record<string, any>,
  NATIVE extends Record<string, any> = Record<string, any>,
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
   * @remarks
   * TODO: replace by show
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
   * @deprecated use minZoom instead
   */
  minScale?: number;
  /**
   * TODO: replace by maxZoom
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
   * Experimental option to set the map loading delay when changing position
   */
  setViewDelay?: number;
  /** Any properties to save in layer.
   * May be useful to get additional info from layer event.
   */
  props?: ANYPROPS;
  /**
   * Map and layer adapter base options
   * Use with care.
   * There may be a conflict in the addLayer method by the adapter of the NextGIS Frontend library
   */
  nativeOptions?: NATIVE;
  ratio?: number;

  /** Experimental only for Ol yet */
  srs?: number;

  onAdded?: (layer: LayerAdapter) => void;

  /** Type for geometries painting, for each layer may be only one of: `point`, `polygon` or `line`. */
  type?: VectorAdapterLayerType;

  layers?: string;
}

export interface MvtAdapterOptions<F extends Feature = Feature>
  extends VectorAdapterOptions<F> {
  url: string;
  sourceLayer?: string;
}

export type VectorAdapterLayerType = 'polygon' | 'point' | 'line';

export type PopupOnCloseFunction = (args: LayerDefinition) => void;

export interface CreatePopupContentProps<F extends Feature = Feature, L = any>
  extends LayerDefinition<F, L> {
  /**
   * The source of the event call. User `click`, `hover`, or programmatic `api` call
   */
  type: OnLayerSelectType;
  /**
   * Close the pop-up programmatically
   */
  close: () => void;
  /**
   * The callback function that is called when the popup is closed
   *
   * @example
   * ```javascript
   * createPopupContent: (e) => {
   *   const onZoomEnd = () => e.close();
   *   ngwMap.emitter.on('zoomend', onZoomEnd)
   *   e.onClose(() => {
   *     ngwMap.emitter.off('zoomend', onZoomEnd)
   *   })
   *   return createContentFunc(e);
   * },
   * ```
   */
  onClose: (cb: PopupOnCloseFunction) => void;
}

export type CreatePopupContent<F extends Feature = Feature, L = any> = (
  props: CreatePopupContentProps<F, L>,
) =>
  | HTMLElement
  | string
  | undefined
  | Promise<HTMLElement | string | undefined>;

export interface PopupOptions<F extends Feature = Feature, L = any> {
  minWidth?: number;
  maxWidth?: number;
  autoPan?: boolean;
  popupContent?: string | HTMLElement;
  fromProperties?: boolean;
  closeButton?: boolean;
  /** Unselect feature on popup close
   * @defaultValue true
   */
  unselectOnClose?: boolean;
  createPopupContent?: CreatePopupContent<F, L>;
}

type _VectorAdapterOptionsToExtend<
  P extends Record<string, any> = Record<string, any>,
  A extends Record<string, any> = Record<string, any>,
  N extends Record<string, any> = Record<string, any>,
> = AdapterOptions<A, N> & FilterOptions<P>;

export interface VectorAdapterOptions<
  F extends Feature = Feature,
  L = any,
  A extends FeatureProperties = Record<string, any>,
  N extends FeatureProperties = Record<string, any>,
  P extends FeatureProperties = ExtractFeatureProperties<F>,
> extends _VectorAdapterOptionsToExtend<P, A, N> {
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
  paint?: Paint<F>;
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
  selectedPaint?: Paint<F>;
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
   * If false, the selection will be reset when the user clicks the map.
   * @defaultValue true
   */
  unselectOnClick?: boolean;
  /**
   * Make the feature selected while mouseover.
   */
  selectOnHover?: boolean;
  popup?: boolean;
  popupOnSelect?: boolean;
  popupOptions?: PopupOptions<F, L>;
  filter?: DataLayerFilter<F, L>;
  propertiesFilter?: PropertiesFilter<P>;
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
  labelField?: keyof P extends null ? string : keyof P;
  label?: (e: LayerDefinition<F, L>) => string;

  source?: unknown;
  /**
   * @deprecated - TODO: move to nativeOptions
   */
  nativePaint?: boolean | Record<string, any>;
  /**
   * @deprecated - TODO: move to nativeOptions
   */
  nativeFilter?: unknown;
  /**
   * @deprecated - TODO: move to nativeOptions
   */
  layout?: any;
  /**
   * @deprecated - TODO: move to nativeOptions
   */
  selectedLayout?: any;

  heightOffset?: number;

  onClick?(opt: OnLayerMouseOptions<F, L>): void;
  onSelect?(opt: OnLayerSelectOptions<F, L>): void;

  /** Fired when the mouse enters the layer. */
  onMouseOver?(opt: OnLayerMouseOptions<F, L>): void;
  /** Fired when the mouse leaves the layer. */
  onMouseOut?(
    opt: Omit<OnLayerMouseOptions<F, L>, keyof FeaturePosition>,
  ): void;

  /** @deprecated use {@link VectorAdapterOptions.onClick} instead */
  onLayerClick?(opt: OnLayerMouseOptions<F, L>): Promise<any>;
  /** @deprecated use {@link VectorAdapterOptions.onSelect} instead */
  onLayerSelect?(opt: OnLayerSelectOptions<F, L>): Promise<any>;
}

export interface GeoJsonAdapterOptions<
  F extends Feature = Feature,
  L = any,
  A extends FeatureProperties = Record<string, any>,
  N extends FeatureProperties = Record<string, any>,
> extends VectorAdapterOptions<F, L, A, N> {
  /** Geojson data */
  data?: GeoJsonObject;
}

export interface RasterAdapterOptions extends AdapterOptions {
  url: string;
  subdomains?: string | string[];
}

export interface TileAdapterOptions extends RasterAdapterOptions {
  tileSize?: number;
}

export interface Tileset3DAdapterOptions
  extends RasterAdapterOptions,
    VectorAdapterOptions {
  useTerrainHeight?: boolean;
  heightOffset?: number;
}

export interface Model3DOptions extends RasterAdapterOptions {
  lon: number;
  lat: number;
  height?: number;
  rotate?: number;
  scale?: number;
}

export interface WmsAdapterOptions extends RasterAdapterOptions {
  format?: 'image/png' | 'image/jpeg' | string;
  version?: string;
  tileSize?: number;
  updateWmsParams?: (obj: {
    [paramName: string]: any;
  }) => Record<string, unknown>;
  transparent?: boolean;
}

export interface ImageAdapterOptions extends WmsAdapterOptions {
  /** @deprecated use `params` option instead */
  resourceId?: string | number;
  params: Record<string, any>;
}

export interface LayerAdapters {
  [name: string]: MainLayerAdapter;
  MVT: VectorLayerAdapter;
  COG: MainLayerAdapter<any, any, RasterAdapterOptions>;
  IMAGE: MainLayerAdapter<any, any, ImageAdapterOptions>;
  WMS: MainLayerAdapter<any, any, WmsAdapterOptions>;
  OSM: MainLayerAdapter;
  TILE: MainLayerAdapter<any, any, TileAdapterOptions>;
  GEOJSON: VectorLayerAdapter<any, any, GeoJsonAdapterOptions>;
}

export interface LayerAdaptersOptions {
  [name: string]: AdapterOptions;
  MVT: MvtAdapterOptions;
  IMAGE: ImageAdapterOptions;
  WMS: WmsAdapterOptions;
  OSM: RasterAdapterOptions;
  TILE: TileAdapterOptions;
  GEOJSON: GeoJsonAdapterOptions;
  COG: RasterAdapterOptions;
}

export interface FeaturePosition {
  /** Get the extent for the geometry on which the action was executed. */
  getBounds: () => LngLatBoundsArray;
  /** Get the center for the geometry on which the action was executed. */
  getCenter: () => LngLatArray;
}

export interface LayerDefinition<F extends Feature = Feature, L = any>
  extends FeaturePosition {
  /** The adapter in which the layer is created. */
  target: LayerAdapter;
  /** A vector layer object in geojson format. */
  feature: F;
  /** Native layer for a specific adapter layers of a specific map adapter. */
  layer?: L;
  /** Is layer on the map */
  visible?: boolean;
}

export type CallbackFilter<F extends Feature = Feature, L = any> = (
  opt: LayerDefinition<F, L>,
) => boolean;

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
  intersects?: string | LngLatArray[] | LngLatBoundsArray;
  strategy?: 'BBOX' | 'BBOX+';
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

export type DataLayerFilter<
  F extends Feature = Feature,
  L = any,
> = CallbackFilter<F, L>;

export type LayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions,
> = MainLayerAdapter<M, L, O> | VectorLayerAdapter<M, L, O>;

export interface MainLayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions,
> {
  options: O;
  order?: number;
  id?: string;
  name?: string;
  layer?: L;
  map?: M;

  addLayer(options: O): L | Promise<L> | undefined;
  updateLayer?(): void;
  removeLayer?(): void;
  beforeRemove?(): void;

  showLayer?(layer?: L): void;
  hideLayer?(layer?: L): void;
  /** @deprecated use {@link MainLayerAdapter.getBounds} instead */
  getExtent?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;
  // TODO: always return Promise
  getBounds?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;
  // TODO: remove from here
  getDependLayers?(): L[];

  setPaint?(paint: Paint): void;
  updatePaint?(paint: Partial<Paint>): void;
  setSelectedPaint?(paint: Paint): void;
  updateSelectedPaint?(paint: Partial<Paint>): void;
  setOpacity?(val: number): void;
}

/**
 * Generic shortcut to define VectorLayerAdapter from feature
 */
export type FeatureLayerAdapter<
  P extends FeatureProperties = FeatureProperties,
  G extends Geometry = Geometry,
  O extends VectorAdapterOptions = VectorAdapterOptions,
  M = any,
  L = any,
> = VectorLayerAdapter<M, L, O, Feature<G, P>>;

/**
 * Adapter for vector data display control.
 */
export interface VectorLayerAdapter<
  M = any,
  L = any,
  O extends VectorAdapterOptions = VectorAdapterOptions,
  F extends Feature = Feature,
  PROP extends Record<string, any> | null = F extends Feature
    ? F['properties']
    : Record<string, string>,
  P extends Record<string, any> = PROP extends null
    ? Record<string, any>
    : PROP,
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
  propertiesFilter?(
    filters: PropertiesFilter<P>,
    options?: FilterOptions<P>,
  ): Promise<void>;
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
  clearLayer?(cb?: (feature: F) => boolean): void | Promise<void>;
  /**
   * Callback function that will be called when clicking on a layer.
   * @param event - Data that is transmitted when you click on a layer.
   */
  onLayerClick?(event: OnLayerMouseOptions): Promise<any>;

  openPopup?(
    findFeatureCb?: DataLayerFilter<F, L>,
    options?: PopupOptions,
  ): void;

  closePopup?(findFeatureCb?: DataLayerFilter<F, L>): void;

  updateTooltip?(layerDef?: LayerDefinition<F, L>): void;
}
