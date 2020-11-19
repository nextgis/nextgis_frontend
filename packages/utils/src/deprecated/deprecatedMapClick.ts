import { debuglog } from 'util';
import { debugLog } from '../debug/debugLog';
import { LatLng } from '../geom/interfaces';
import { LngLatArray } from '../geom/interfaces';

interface DeprecatedMapClickEvent {
  lngLat: LngLatArray;
  latLng?: LatLng;
}

/**
 *
 * @param ev @deprecated
 */
export function deprecatedMapClick<
  T extends DeprecatedMapClickEvent = DeprecatedMapClickEvent
>(ev: T): T {
  if (!ev.lngLat && ev.latLng) {
    debugLog('deprecated use of latLng in MapClickEvent, use lngLat instead');
    const lat = ev.latLng.lat;
    const lng = ev.latLng.lng;
    ev.lngLat = [lng, lat];
  }
  return ev;
}
