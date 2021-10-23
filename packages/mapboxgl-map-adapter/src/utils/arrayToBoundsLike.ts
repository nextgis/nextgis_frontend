import type { LngLatBoundsLike } from 'maplibre-gl';
import type { LngLatBoundsArray } from '@nextgis/utils';

export function arrayToBoundsLike(bounds: LngLatBoundsArray): LngLatBoundsLike {
  const e = bounds;

  return [
    [e[0], e[1]],
    [e[2], e[3]],
  ];
}
