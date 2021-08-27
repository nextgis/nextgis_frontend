import { debugLog } from '../debug/debugLog';

import type { LatLng } from '../geom/interfaces';
import type { LngLatArray } from '../geom/interfaces';

interface DeprecatedMapClickEvent {
  lngLat: LngLatArray;
  latLng?: LatLng;
}

/**
 * @internal
 */
export function deprecatedMapClick<
  T extends DeprecatedMapClickEvent = DeprecatedMapClickEvent,
>(ev: T): T {
  if (!ev.lngLat && ev.latLng) {
    debugLog('deprecated use of latLng in MapClickEvent, use lngLat instead');
    const lat = ev.latLng.lat;
    const lng = ev.latLng.lng;
    ev.lngLat = [lng, lat];
  }
  return ev;
}
