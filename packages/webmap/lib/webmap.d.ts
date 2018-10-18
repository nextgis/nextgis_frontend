import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters, MvtAdapterOptions, GeoJsonAdapterOptions } from './interfaces/LayerAdapter';
import { MapAdapter } from './interfaces/MapAdapter';
import { StarterKit } from './interfaces/AppSettings';
import { DialogAdapter, DialogAdapterOptions } from './interfaces/DialogAdapter';
import { MapControl, MapControls, AttributionControlOptions, ZoomControlOptions } from './interfaces/MapControl';
export { WebMap, AppOptions, LayerAdapter, LayerAdapters, MvtAdapterOptions, GeoJsonAdapterOptions, MapAdapter, MapOptions, StarterKit, DialogAdapter, DialogAdapterOptions, MapControl, MapControls, AttributionControlOptions, ZoomControlOptions, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
