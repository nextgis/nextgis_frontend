import { NgwMap } from './NgwMap';
import type { NgwMapOptions } from './interfaces';

export * from '@nextgis/webmap';

export * from './interfaces';

export { NgwMap };

export async function createNgwMap(options: NgwMapOptions): Promise<NgwMap> {
  const ngwMap = new NgwMap(options);
  return ngwMap.onLoad();
}
