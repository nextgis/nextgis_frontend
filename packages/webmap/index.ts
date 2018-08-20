import { WebMap } from './src/entities/WebMap';
import { AppOptions, MapOptions } from './src/interfaces/WebMapApp';
import { LayerAdapter, LayerAdapters } from './src/interfaces/LayerAdapter';
import { MapAdapter } from './src/interfaces/MapAdapter';

export {
  WebMap, AppOptions,
  LayerAdapter, LayerAdapters,
  MapAdapter, MapOptions,
};

// Composition root
export async function buildWebMap(appOpt: AppOptions, mapOpt: MapOptions): Promise<WebMap> {
  const webMap = new WebMap(appOpt);
  await webMap.create(mapOpt);
  return webMap;
}

declare global {
  interface Window {
    WebMap: WebMap;
    buildWebMap: (options, config) => Promise<WebMap>;
  }
}

window.buildWebMap = buildWebMap;
