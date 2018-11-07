import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { MapAdapter, ControlPositions } from './interfaces/MapAdapter';
import { DialogAdapter, DialogAdapterOptions } from './interfaces/DialogAdapter';
import { MapControl, MapControls, AttributionControlOptions, ZoomControlOptions } from './interfaces/MapControl';
export * from './interfaces/LayerAdapter';
export * from './interfaces/AppSettings';
export { WebMap, AppOptions, MapOptions, MapAdapter, ControlPositions, DialogAdapter, DialogAdapterOptions, MapControl, MapControls, AttributionControlOptions, ZoomControlOptions, };
export declare function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap>;
