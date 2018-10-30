import { GeoJsonObject } from 'geojson';
import { LatLng } from './BaseTypes';
interface AdapterOptions {
    id?: string;
    url?: string;
    transparency?: number;
    minResolution?: number;
    maxResolution?: number;
    styleId?: number;
}
export interface MvtAdapterOptions extends AdapterOptions {
    paint?: any;
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
export {};
