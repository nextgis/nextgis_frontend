/**
 * @module webmap
 */

import { GeoJsonObject, Feature } from 'geojson';
import { LatLng, LayerExtent } from './BaseTypes';

export interface OnLayerClickOptions {
  layer: LayerAdapter;
  selected?: boolean;
  feature?: Feature;
}

export interface AdapterOptions {
  id?: string;
  // is on the map
  visibility?: boolean;
  baseLayer?: boolean;
  order?: number;

  attribution?: string;
  maxZoom?: number;
  minZoom?: number;

  // move out of here
  maxResolution?: number;
  minResolution?: number;
  transparency?: number;
  url?: string;
  styleId?: number;
  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
}

export interface MvtAdapterOptions extends AdapterOptions {
  paint?: any;
  type?: 'fill' | 'line' | 'circle' | 'point';
  'source-layer'?: string;
}

export type GeoJsonAdapterLayerType = 'fill' | 'circle' | 'line';

export interface BasePaint {
  type?: string;
  color?: string;
  opacity?: number;
  stroke?: boolean;
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

export interface GeoJsonAdapterOptions extends AdapterOptions {
  data?: GeoJsonObject;
  type?: GeoJsonAdapterLayerType;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  // selectedPaintDiff?: GeoJsonAdapterLayerPaint;

  selectable?: boolean;
  multiselect?: boolean;
  unselectOnSecondClick?: boolean;
}

export interface MarkerAdapterOptions extends AdapterOptions {
  latLng: LatLng;
}

export interface TileAdapterOptions extends AdapterOptions {
  url: string;
  tileSize: number;
  subdomains?: string;
}

export interface ImageAdapterOptions extends AdapterOptions {
  resourceId: string | number;
  updateWmsParams?: (obj: { [paramName: string]: any }) => object;
  transparent?: boolean;
  subdomains?: string;
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
  'OSM': AdapterOptions;
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

  showLayer?(layer: L): void;
  hideLayer?(layer: L): void;

  getExtent?(): LayerExtent | Promise<LayerExtent> | undefined;

  // remove from this place
  getDependLayers?(): L[];
}

export interface VectorLayerAdapter<
  M = any, L = any, O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions, F extends Feature = Feature>
  extends BaseLayerAdapter<M, L, O> {

  getPaintFunctions?: { [name: string]: GetPaintFunction };

  selected?: boolean;

  getLayers?(): Array<LayerDefinition<F, L>>;

  select?(findFeatureCb?: DataLayerFilter<F, L>): void;
  unselect?(findFeatureCb?: DataLayerFilter<F, L>): void;
  getSelected?(): Array<{ layer?: L, feature?: Feature }>;

  filter?(cb: DataLayerFilter<F, L>): void;

  setData?(data: GeoJsonObject): void;
  addData?(data: GeoJsonObject): void;
  clearLayer?(cb?: (feature: Feature) => boolean): void;

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;
}
