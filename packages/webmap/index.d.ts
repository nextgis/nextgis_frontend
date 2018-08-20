import { WebMap } from './src/entities/WebMap';
import { AppOptions, MapOptions } from './src/interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters } from './src/interfaces/LayerAdapter';
import { MapAdapter } from './src/interfaces/MapAdapter';
export { WebMap, AppOptions, LayerAdapter, LayerAdapters, MapAdapter, MapOptions, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
declare global {
    interface Window {
        WebMap: WebMap;
        buildWebMap: (options: any, config: any) => Promise<WebMap>;
    }
}
