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
    data?: any;
}
export interface LayerAdapters {
    'MVT': MvtAdapterOptions;
    'IMAGE': AdapterOptions;
    'OSM': AdapterOptions;
    'TILE': AdapterOptions;
    'GEOJSON': GeoJsonAdapterOptions;
    [name: string]: AdapterOptions;
}
export interface LayerAdapter<M = any, O = any> {
    name: string;
    map?: M;
    addLayer(options: O): any;
}
export {};
