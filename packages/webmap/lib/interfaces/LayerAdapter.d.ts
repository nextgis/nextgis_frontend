interface AdapterOptions {
    id?: string;
    url?: string;
    transparency?: number;
    minResolution?: number;
    maxResolution?: number;
    styleId?: number;
}
interface MvtOptions extends AdapterOptions {
    paint?: any;
    type?: 'fill' | 'line' | 'circle' | 'point';
    'source-layer'?: string;
}
export interface LayerAdapters {
    'MVT': MvtOptions;
    'IMAGE': AdapterOptions;
    'OSM': AdapterOptions;
    'TILE': AdapterOptions;
    [name: string]: AdapterOptions;
}
export interface LayerAdapter<M = any, O = any> {
    name: string;
    addLayer(map: M, name: string, options: O): string;
}
export {};
