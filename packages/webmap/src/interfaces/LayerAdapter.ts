/**
 * @module webmap
 */

import { GeoJsonObject, Feature } from 'geojson';
import { LatLng, LngLatBoundsArray } from './BaseTypes';

export interface OnLayerClickOptions {
  layer: LayerAdapter;
  selected?: boolean;
  feature?: Feature;
}

export interface AdapterOptions {
  id?: string;
  /**
   * Show layer on the map immediately after adding
   * @default false
   */
  visibility?: boolean;
  baseLayer?: boolean;
  order?: number;
  attribution?: string;
  maxZoom?: number;
  minZoom?: number;
}

export interface MvtAdapterOptions extends AdapterOptions {
  url?: string;
  paint?: any;
  type?: 'fill' | 'line' | 'circle' | 'point';
  'source-layer'?: string;
}

export type GeoJsonAdapterLayerType = 'fill' | 'circle' | 'line' | 'icon';

export interface BasePaint {
  type?: string;
  color?: string;
  opacity?: number;
  fill?: boolean;
  stroke?: boolean;
  strokeColor?: string;
  strokeOpacity?: number;
}

export interface CirclePaint extends BasePaint {
  type: 'circle';
  radius?: number;
}

export interface PathPaint extends BasePaint {
  type: 'path';
  weight?: number;
}

export interface IconOptions {
  type: 'icon';
  className?: string;
  html?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

export type GetPaintFunction = (opt?: any) => GeoJsonAdapterLayerPaint;

export interface GetCustomPaintOptions {
  type: 'get-paint';
  from: string | GetPaintFunction;
  options?: any;
}

export type GeoJsonAdapterLayerPaint = CirclePaint | PathPaint | IconOptions | GetCustomPaintOptions;

export type GetPaintCallback = (feature: Feature<any>) => GeoJsonAdapterLayerPaint;

/**
 * Options to crateing styling and defining selection behavior
 */
export interface GeoJsonAdapterOptions<F extends Feature = Feature, L = any> extends AdapterOptions {
  /** Geojson data */
  data?: GeoJsonObject;
  /** Type for geometries painting, for each layer may be only one of: `fill`, `circle` or `line` */
  type?: GeoJsonAdapterLayerType;
  /**
   * Determine the appearance of the vector data geometries
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
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  /**
   * The paint that applies to the features after it becomes selected
   *
   * @example
   * ```javascript
   * webMap.addLayer('GEOJSON', {
   *   paint: { color: 'red' },
   *   selectedPaint: { color: 'green' }
   * });
   * ```
   */
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  // selectedPaintDiff?: GeoJsonAdapterLayerPaint;
  /**
   * Determines whether objects are selected by mouse click
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
  /**
   * Indicates whether several objects can be selected in one layer
   *
   * @example
   * // multiselect: false
   * layer.select(({ feature }) => feature.properties.color === 'green'); // one feature will be selected
   * // multiselect: true
   * layer.select(({ feature }) => feature.properties.color === 'green'); // all 'green' features will be selected
   */
  multiselect?: boolean;
  /**
   * Deselects layer feature by second click
   */
  unselectOnSecondClick?: boolean;
  filter?: DataLayerFilter;
  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
}

export interface MarkerAdapterOptions extends AdapterOptions {
  latLng: LatLng;
}

interface RasterAdapterOptions extends AdapterOptions {
  url: string;
  subdomains?: string;
  headers?: any;
}

export interface TileAdapterOptions extends RasterAdapterOptions {
  tileSize?: number;
  subdomains?: string;
}

export interface ImageAdapterOptions extends RasterAdapterOptions {
  resourceId: string | number;
  updateWmsParams?: (obj: { [paramName: string]: any }) => object;
  transparent?: boolean;
}

export interface LayerAdapters {
  'MVT': BaseLayerAdapter;
  'IMAGE': BaseLayerAdapter;
  'OSM': BaseLayerAdapter;
  'TILE': BaseLayerAdapter;
  'MARKER': BaseLayerAdapter;
  'GEOJSON': VectorLayerAdapter;
  [name: string]: BaseLayerAdapter;
}

export interface LayerAdaptersOptions {
  'MVT': MvtAdapterOptions;
  'IMAGE': ImageAdapterOptions;
  'OSM': RasterAdapterOptions;
  'TILE': TileAdapterOptions;
  'MARKER': MarkerAdapterOptions;
  'GEOJSON': GeoJsonAdapterOptions;
  [name: string]: AdapterOptions;
}

export interface LayerDefinition<F extends Feature = Feature, L = any> {
  layer?: L;
  feature?: F;
  visible?: boolean;
}

export type DataLayerFilter<F extends Feature = Feature, L = any> = (opt: LayerDefinition<F, L>) => boolean;

export type LayerAdapter<M = any, L = any, O extends AdapterOptions = AdapterOptions> =
  BaseLayerAdapter<M, L, O> |
  VectorLayerAdapter<M, L, O>;

export interface BaseLayerAdapter<M = any, L = any, O extends AdapterOptions = AdapterOptions> {

  options: O;
  id?: string;
  layer?: L;
  map?: M;

  addLayer(options: O): L | Promise<L> | undefined;
  removeLayer?(): void;

  showLayer?(layer: L): void;
  hideLayer?(layer: L): void;

  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;

  // remove from this place
  getDependLayers?(): L[];
}

export interface VectorLayerAdapter<
  M = any, L = any, O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions, F extends Feature = Feature>
  extends BaseLayerAdapter<M, L, O> {

  selected?: boolean;

  getLayers?(): Array<LayerDefinition<F, L>>;

  select?(findFeatureCb?: DataLayerFilter<F, L>): void;
  unselect?(findFeatureCb?: DataLayerFilter<F, L>): void;
  getSelected?(): Array<{ layer?: L, feature?: Feature }>;

  filter?(cb: DataLayerFilter<F, L>): void;
  removeFilter?(): void;

  addData(data: GeoJsonObject): void;
  clearLayer(cb?: (feature: Feature) => boolean): void;
  setData?(data: GeoJsonObject): void;

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
}
