import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters } from './interfaces/LayerAdapter';
import { MapAdapter } from './interfaces/MapAdapter';
import { StarterKit } from './interfaces/AppSettings';
import { DialogAdapter, DialogAdapterOptions } from './interfaces/DialogAdapter';
export { WebMap, AppOptions, LayerAdapter, LayerAdapters, MapAdapter, MapOptions, StarterKit, DialogAdapter, DialogAdapterOptions, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
