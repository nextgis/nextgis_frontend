import { GeoJsonObject } from 'geojson';
import { LatLng } from './BaseTypes';

interface AdapterOptions {
  id?: string;
  url?: string;
  transparency?: number;
  // visibility: item.layer_enabled,
  minResolution?: number;
  maxResolution?: number;

  // move out of here
  styleId?: number;
}

export interface MvtAdapterOptions extends AdapterOptions {
  paint?;
  type?: 'fill' | 'line' | 'circle' | 'point';
  'source-layer'?: string;
}

export interface GeoJsonAdapterOptions extends AdapterOptions {
  data?: GeoJsonObject;
}

export interface MarkerAdapterOptions extends AdapterOptions {
  latLng: LatLng;
}

export interface LayerAdapters {
  'MVT': MvtAdapterOptions;
  'IMAGE': AdapterOptions;
  'OSM': AdapterOptions;
  'TILE': AdapterOptions;
  'MARKER': MarkerAdapterOptions;
  'GEOJSON': GeoJsonAdapterOptions;
  [name: string]: AdapterOptions;
}

export interface LayerAdapter<M = any, O = any> {
  name: string;
  map?: M;
  addLayer(options: O): any;
}
