import { GeoJsonObject, Feature } from 'geojson';
import { LatLng, LayerExtent } from './BaseTypes';

export interface OnLayerClickOptions {
  adapter: LayerAdapter;
  selected?: boolean;
  layer?: any;
  feature?: Feature;
}

export interface AdapterOptions {
  id?: string;
  url?: string;
  transparency?: number;
  visibility?: boolean;
  attribution?: string;
  maxZoom?: number;
  minZoom?: number;
  minResolution?: number;
  maxResolution?: number;
  order?: number;
  // move out of here
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
  'MVT': LayerAdapter;
  'IMAGE': LayerAdapter;
  'OSM': LayerAdapter;
  'TILE': LayerAdapter;
  'MARKER': LayerAdapter;
  'GEOJSON': VectorLayerAdapter;
  [name: string]: LayerAdapter;
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

export interface BaseLayerAdapter<M = any, L = any, O = any> {

  options?: O;
  name?: string;
  layer?: L;
  map?: M;

  addLayer(options: O): any | Promise<any>;

  showLayer?(layer: L): void;
  hideLayer?(layer: L): void;

  getExtent?(): LayerExtent | Promise<LayerExtent> | undefined;

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
