import { WebMap } from '@nextgis/webmap';
import { NgwMapEvents } from './interfaces';

/**
 * Decorator to run action only after map is created
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function onMapLoad() {
  return WebMap.decorators.onLoad<NgwMapEvents>('build-map');
}
