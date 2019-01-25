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
  data: GeoJsonObject;
  type?: GeoJsonAdapterLayerType;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaintDiff?: GeoJsonAdapterLayerPaint;

  selectable?: boolean;
  multiselect?: boolean;
  unselectOnSecondClick?: boolean;
}

export interface MarkerAdapterOptions extends AdapterOptions {
  latLng: LatLng;
}

export interface ImageAdapterOptions extends AdapterOptions {
  resourceId: string | number;
  updateWmsParams?: (obj: { [paramName: string]: any }) => object;
  transparent?: boolean;
}

export interface LayerAdapters {
  'MVT': MvtAdapterOptions;
  'IMAGE': ImageAdapterOptions;
  'OSM': AdapterOptions;
  'TILE': AdapterOptions;
  'MARKER': MarkerAdapterOptions;
  'GEOJSON': GeoJsonAdapterOptions;
  [name: string]: AdapterOptions;
}

export type DataLayerFilter<L> = (opt: { layer?: L, feature?: Feature }) => boolean;

export interface LayerAdapter<O = any, L = any, M = any> {
  getPaintFunctions?: { [name: string]: GetPaintFunction };

  name: string;
  layer?: L;
  opt?: M;
  selected?: boolean;

  addLayer(options: O): any | Promise<any>;

  showLayer?(layer: L): void;
  hideLayer?(layer: L): void;

  getLayers?(): Array<{ feature?: Feature, layer?: L, visible?: boolean }>;

  select?(findFeatureCb?: DataLayerFilter<L>): void;
  unselect?(findFeatureCb?: DataLayerFilter<L>): void;
  getSelected?(): Array<{ layer?: L, feature?: Feature }>;

  filter?(cb: DataLayerFilter<L>): void;

  setData?(data: GeoJsonObject): void;
  addData?(data: GeoJsonObject): void;
  clearLayer?(cb?: (feature: Feature) => boolean): void;

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;

  getExtent?(): LayerExtent | Promise<LayerExtent>;

  getDependLayers?(): L[];
}
