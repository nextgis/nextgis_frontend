import type { LatLngBounds } from 'leaflet';
import type { LngLatBoundsArray } from '@nextgis/utils';

export function boundsToArray(bounds: LatLngBounds): LngLatBoundsArray {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return [sw.lng, sw.lat, ne.lng, ne.lat];
}
