import { GeoJsonObject } from 'geojson';
import { LatLng } from './BaseTypes';
export interface AdapterOptions {
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
export interface ImageAdapterOptions extends AdapterOptions {
    resourceId: string | number;
    updateWmsParams?: (object: any) => object;
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
export interface LayerAdapter<M = any, O = any> {
    name: string;
    layer?: any;
    map?: M;
    addLayer(options: O): any;
}
