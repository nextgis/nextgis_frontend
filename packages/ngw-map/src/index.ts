import { MapAdapter } from '@nextgis/webmap';
import { NgwMap } from './NgwMap';
import { NgwMapOptions } from './interfaces';

export * from '@nextgis/webmap';

export * from './interfaces';

export { NgwMap };

export async function createMap(
  mapAdapter: MapAdapter,
  options: NgwMapOptions
): Promise<NgwMap> {
  const ngwMap = new NgwMap(mapAdapter, options);
  return ngwMap.onLoad();
}
