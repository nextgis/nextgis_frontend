import { WebMap } from './WebMap';

import type { MapOptions } from './interfaces/MapOptions';

export * from './components/controls/createToggleControl';

export * from './utils/geometryTypes';
export * from './utils/getDefaultControls';
export * from './utils/updateGeoJsonAdapterOptions';

export * from './container';

export * from './WebMapLayers';
export * from './WebMapControls';
export * from './WebMapMain';

export * from './interfaces/Events';
export * from './interfaces/BaseTypes';
export * from './interfaces/MapOptions';
export * from './interfaces/MapAdapter';
export * from './interfaces/MapControl';
export * from './interfaces/LegendItem';
export * from './interfaces/StarterKit';
export * from './interfaces/LayerAdapter';
export * from './interfaces/RuntimeParams';

export { WebMap };

export async function createWebMap(options: MapOptions): Promise<WebMap> {
  const webMap = new WebMap(options);
  return webMap.onLoad();
}
