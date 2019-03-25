import WebMap from '@nextgis/webmap';
import { NgwMapEvents } from './interfaces';

/**
 * Decorator to run action only after map is created
 */
export function onMapLoad() {
  return WebMap.decorators.onLoad<NgwMapEvents>('build-map');
}
