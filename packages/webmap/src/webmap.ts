import { WebMap } from './entities/WebMap';
import { AppOptions, MapOptions } from './interfaces/WebMapApp';
import { MapAdapter, ControlPositions } from './interfaces/MapAdapter';
import { DialogAdapter, DialogAdapterOptions } from './interfaces/DialogAdapter';
import { MapControl, MapControls, AttributionControlOptions, ZoomControlOptions } from './interfaces/MapControl';
export * from './interfaces/LayerAdapter';
export * from './interfaces/AppSettings';

export {
  WebMap, AppOptions, MapOptions,
  MapAdapter, ControlPositions,
  DialogAdapter, DialogAdapterOptions,
  MapControl, MapControls, AttributionControlOptions, ZoomControlOptions,
};

// Composition root
export async function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap> {
  const webMap = new WebMap(appOpt);
  await webMap.create(mapOpt);
  return webMap;
}

// declare global {
//   interface Window {
//     WebMap: WebMap;
//     buildWebMap: (options, config) => Promise<WebMap>;
//   }
// }

// @ts-ignore
window.buildWebMap = buildWebMap;
