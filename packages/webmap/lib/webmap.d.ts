import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters } from './interfaces/LayerAdapter';
import { MapAdapter } from './interfaces/MapAdapter';
export { WebMap, AppOptions, LayerAdapter, LayerAdapters, MapAdapter, MapOptions, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
declare global {
    interface Window {
        WebMap: WebMap;
        buildWebMap: (options: any, config: any) => Promise<WebMap>;
    }
}
