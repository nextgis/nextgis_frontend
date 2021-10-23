import type { LatLngBoundsExpression } from 'leaflet';
import type { LngLatBoundsArray } from '@nextgis/utils';

export function arrayToBoundsExpression(
  bounds: LngLatBoundsArray,
): LatLngBoundsExpression {
  const e = bounds;
  // top, left, bottom, right
  return [
    [e[3], e[0]],
    [e[1], e[2]],
  ];
}
