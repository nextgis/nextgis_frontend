import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters } from './interfaces/LayerAdapter';
import { MapAdapter } from './interfaces/MapAdapter';
import { StarterKit } from './interfaces/AppSettings';
export { WebMap, AppOptions, LayerAdapter, LayerAdapters, MapAdapter, MapOptions, StarterKit, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
declare global {
    interface Window {
        WebMap: WebMap;
        buildWebMap: (options: any, config: any) => Promise<WebMap>;
    }
}
