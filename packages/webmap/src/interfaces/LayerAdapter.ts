/**
 * @module webmap
 */
import { GeoJsonObject, Feature } from 'geojson';
import { LatLng, LngLatBoundsArray, Type } from './BaseTypes';
import { MapClickEvent } from './MapAdapter';
import {
  PropertiesFilter,
  Operations,
  PropertyFilter,
  checkIfPropertyFilter
} from '@nextgis/utils';

// backward compatibility
export { PropertiesFilter, Operations, PropertyFilter, checkIfPropertyFilter };

export type AdapterConstructor = () => Promise<Type<LayerAdapter> | undefined>;

export interface OnLayerClickOptions {
  layer: LayerAdapter;
  selected?: boolean;
  feature?: Feature;
  event?: MapClickEvent;
  source?: any;
}

export interface AdapterOptions {
  id?: string;
  /**
   * Show layer on the map immediately after adding.
   * @default false
   */
  visibility?: boolean;
  baseLayer?: boolean;
  order?: number;
  attribution?: string;
  maxZoom?: number;
  minZoom?: number;
  minScale?: number;
  maxScale?: number;
  /**
   * from 0-transparent to 1-visible
   * @default 1
   */
  opacity?: number;
  /**
   * Fit map for layer extent
   * @default false
   */
  fit?: boolean;
  name?: string;
  adapter?: string;
}

export interface MvtAdapterOptions<F extends Feature = Feature>
  extends VectorAdapterOptions<F> {
  url: string;
  // type?: 'fill' | 'line' | 'circle' | 'point';
  sourceLayer?: string;
}

export type VectorAdapterLayerType = 'fill' | 'circle' | 'line' | 'icon';

export interface BasePaint {
  type?: string;
  color?: string;
  opacity?: number;
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  stroke?: boolean;
  strokeColor?: string;
  strokeOpacity?: number;
}

export interface CirclePaint extends BasePaint {
  type?: 'circle';
  radius?: number;
}

export interface PathPaint extends BasePaint {
  type?: 'path';
  weight?: number;
}

export type GeometryPaint = PathPaint & CirclePaint;

export interface IconPaint {
  type: 'icon';
  className?: string;
  html?: string;
  svg?: HTMLElement;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

/**
 * @deprecated use IconPaint instead
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IconOptions extends IconPaint {}

export type GetPaintFunction = (opt?: any) => VectorAdapterLayerPaint;

export interface GetCustomPaintOptions {
  type: 'get-paint';
  from: string | GetPaintFunction;
  options?: any;
}

export type VectorAdapterLayerPaint =
  | CirclePaint
  | PathPaint
  | IconOptions
  | GetCustomPaintOptions;

export type GetPaintCallback<F = Feature> = (
  feature: F
) => VectorAdapterLayerPaint;

export type Paint = VectorAdapterLayerPaint | GetPaintCallback;

export interface PopupOptions {
  minWidth?: number;
  autoPan?: boolean;
  createPopupContent?: (
    layerDef: LayerDefinition
  ) => HTMLElement | string | undefined;
}

export interface VectorAdapterOptions<F extends Feature = Feature, L = any>
  extends AdapterOptions {
  /** Type for geometries painting, for each layer may be only one of: `fill`, `circle` or `line`. */
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
  paint?: VectorAdapterLayerPaint | GetPaintCallback;
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
  selectedPaint?: VectorAdapterLayerPaint | GetPaintCallback;
  nativePaint?: boolean | Record<string, any>;
  nativeFilter?: unknown;
  layout?: any;
  selectedLayout?: any;
  limit?: number;
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
}

/**
 * Options to crateing styling and defining selection behavior.
 */
export interface GeoJsonAdapterOptions<F extends Feature = Feature, L = any>
  extends VectorAdapterOptions<F, L> {
  /** Geojson data */
  data?: GeoJsonObject;
}

export interface MarkerAdapterOptions extends AdapterOptions {
  latLng: LatLng;
}

interface RasterAdapterOptions extends AdapterOptions {
  url: string;
  subdomains?: string;
  headers?: Record<string, any>;
}

export interface TileAdapterOptions extends RasterAdapterOptions {
  tileSize?: number;
}

export interface ImageAdapterOptions extends RasterAdapterOptions {
  resourceId: string | number;
  updateWmsParams?: (obj: { [paramName: string]: any }) => object;
  transparent?: boolean;
}

export interface LayerAdapters {
  [name: string]: BaseLayerAdapter;
  MVT: VectorLayerAdapter;
  IMAGE: BaseLayerAdapter;
  OSM: BaseLayerAdapter;
  TILE: BaseLayerAdapter;
  MARKER: BaseLayerAdapter;
  GEOJSON: VectorLayerAdapter;
}

export interface LayerAdaptersOptions {
  [name: string]: AdapterOptions;
  MVT: MvtAdapterOptions;
  IMAGE: ImageAdapterOptions;
  OSM: RasterAdapterOptions;
  TILE: TileAdapterOptions;
  MARKER: MarkerAdapterOptions;
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
  intersects?: string;
}

export type DataLayerFilter<
  F extends Feature = Feature,
  L = any
> = CallbackFilter<F, L>;

export type LayerAdapter<
  M = any,
  L = any,
  O extends AdapterOptions = AdapterOptions
> = BaseLayerAdapter<M, L, O> | VectorLayerAdapter<M, L, O>;

export interface BaseLayerAdapter<
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

  showLayer?(layer: L): void;
  hideLayer?(layer: L): void;

  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;

  // remove from this place
  getDependLayers?(): L[];
}

export interface VectorLayerAdapter<
  M = any,
  L = any,
  O extends VectorAdapterOptions = VectorAdapterOptions,
  F extends Feature = Feature
> extends BaseLayerAdapter<M, L, O> {
  selected?: boolean;
  source?: unknown;

  getLayers?(): Array<LayerDefinition<F, L>>;

  select?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  unselect?(findFeatureCb?: DataLayerFilter<F, L> | PropertiesFilter): void;
  getSelected?(): Array<LayerDefinition<Feature, L>>;

  getFiltered?(): Array<LayerDefinition<Feature, L>>;
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
