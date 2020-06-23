import { GeoJsonObject, Feature } from 'geojson';
import { LngLatBoundsArray, Type } from './BaseTypes';
import { MapClickEvent } from './MapAdapter';
import {
  PropertiesFilter,
  Operations,
  PropertyFilter,
  checkIfPropertyFilter,
} from '@nextgis/properties-filter';
import { Paint } from '@nextgis/paint';

// backward compatibility
export { PropertiesFilter, Operations, PropertyFilter, checkIfPropertyFilter };

export type AdapterConstructor = () => Promise<Type<LayerAdapter> | any>;

export type LayerAdapterDefinition<K extends keyof LayerAdapters = string> =
  | K
  | Type<LayerAdapters[K]>
  | Promise<Type<LayerAdapters[K]> | undefined>;

export interface OnLayerSelectOptions {
  layer: LayerAdapter;
  features?: Feature[] | undefined;
}

export interface OnLayerClickOptions {
  layer: LayerAdapter;
  selected?: boolean;
  feature?: Feature;
  event?: MapClickEvent;
  source?: any;
}

export interface AdapterOptions {
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
   * @default true
   */
  visibility?: boolean;
  /**
   * Indicate on a cartographic base layer.
   */
  baselayer?: boolean;
  /**
   * @deprecated use `baselayer` instead
   */
  baseLayer?: boolean;
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
   */
  minScale?: number;
  /**
   * TODO: replace by maxZoom
   * @internal
   */
  maxScale?: number;
  /**
   * Layer transparency.
   * From 0-transparent to 1-visible
   * @default 1
   */
  opacity?: number;
  /**
   * Fit map to layer extent
   * @default false
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
   * @remark
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
}

export interface MvtAdapterOptions<F extends Feature = Feature>
  extends VectorAdapterOptions<F> {
  url: string;
  sourceLayer?: string;
}

export type VectorAdapterLayerType = 'polygon' | 'point' | 'line';

export interface PopupOptions {
  minWidth?: number;
  autoPan?: boolean;
  popupContent?: string | HTMLElement;
  fromProperties?: boolean;
  createPopupContent?: (
    layerDef: LayerDefinition
  ) => HTMLElement | string | undefined;
}

type _VectorAdapterOptionsToExtend = AdapterOptions & FilterOptions;

export interface VectorAdapterOptions<F extends Feature = Feature, L = any>
  extends _VectorAdapterOptionsToExtend {
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
  nativeOptions?: Record<string, any>;
  nativePaint?: boolean | Record<string, any>;
  nativeFilter?: unknown;
  layout?: any;
  selectedLayout?: any;
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
   * // multiselect: false
   * layer.select(({ feature }) => feature.properties.color === 'green'); // one feature will be selected
   * // multiselect: true
   * layer.select(({ feature }) => feature.properties.color === 'green'); // all 'green' features will be selected
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
   * @defaults 50
   */
  clusterRadius?: number;

  source?: unknown;

  labelField?: string;
  label?: (e: LayerDefinition<F, L>) => void | string;

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
  onLayerSelect?(opt: OnLayerSelectOptions): Promise<any>;
}

export interface GeoJsonAdapterOptions<F extends Feature = Feature, L = any>
  extends VectorAdapterOptions<F, L> {
  /** Geojson data */
  data?: GeoJsonObject;
}

export interface RasterAdapterOptions extends AdapterOptions {
  url: string;
  subdomains?: string;
  headers?: Record<string, any>;
}

export interface TileAdapterOptions extends RasterAdapterOptions {
  tileSize?: number;
}

export interface Tileset3DAdapterOptions extends RasterAdapterOptions {
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
  layers?: string;
  format?: 'image/png' | 'image/jpeg' | string;
  version?: string;
  tileSize?: number;
  updateWmsParams?: (obj: {
    [paramName: string]: any;
  }) => Record<string, unknown>;
  transparent?: boolean;
}

export interface ImageAdapterOptions extends WmsAdapterOptions {
  /** @deprecated use `layer` option instead */
  resourceId?: string | number;
}

export interface LayerAdapters {
  [name: string]: MainLayerAdapter;
  MVT: VectorLayerAdapter;
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
}

export interface LayerDefinition<F extends Feature = Feature, L = any> {
  layer?: L;
  feature?: F;
  visible?: boolean;
}

export type CallbackFilter<F extends Feature = Feature, L = any> = (
  opt: LayerDefinition<F, L>
) => boolean;

export interface FilterOptions {
  limit?: number;
  fields?: string[];
  /** WKT polygon geometry */
  intersects?: string;
  strategy?: 'BBOX';
  /**
   * set fields for order
   * @example
   * ```json
   * { "orderBy": ["field1", "-field2" ]}
   * ```
   */
  orderBy?: string[];
}

export type DataLayerFilter<
  F extends Feature = Feature,
  L = any
> = CallbackFilter<F, L>;

export type LayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions
> = MainLayerAdapter<M, L, O> | VectorLayerAdapter<M, L, O>;

export interface MainLayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions
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

  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;

  // remove from this place
  getDependLayers?(): L[];
}

export interface VectorLayerAdapter<
  M = any,
  L = any,
  O extends VectorAdapterOptions = VectorAdapterOptions,
  F extends Feature = Feature
> extends MainLayerAdapter<M, L, O> {
  selected?: boolean;
  source?: unknown;

  getLayers?(): LayerDefinition<F, L>[];

  select?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  unselect?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  getSelected?(): LayerDefinition<Feature, L>[];

  getFiltered?(): LayerDefinition<Feature, L>[];
  filter?(cb: DataLayerFilter<F, L>): Array<LayerDefinition<Feature, L>>;
  propertiesFilter?(filters: PropertiesFilter, options?: FilterOptions): void;
  removeFilter?(): void;

  addData?(data: GeoJsonObject): void;
  clearLayer?(cb?: (feature: Feature) => boolean): void;
  setData?(data: GeoJsonObject): void;

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;

  openPopup?(
    findFeatureCb?: DataLayerFilter<F, L>,
    options?: PopupOptions
  ): void;
  closePopup?(findFeatureCb?: DataLayerFilter<F, L>): void;

  updateTooltip?(layerDef?: LayerDefinition<F, L>): void;
}
