import type { LngLatBoundsArray } from '@nextgis/utils';
import type { LatLngBounds } from 'leaflet';

export function boundsToArray(bounds: LatLngBounds): LngLatBoundsArray {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return [sw.lng, sw.lat, ne.lng, ne.lat];
}
