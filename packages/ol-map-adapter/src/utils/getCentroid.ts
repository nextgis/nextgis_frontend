import polylabel from 'polylabel';
import { getCoordinates } from '@nextgis/utils';

import type { Feature } from 'geojson';

export function getCentroid(feature: Feature): number[] {
  if (feature.geometry.type === 'Polygon') {
    return polylabel(feature.geometry.coordinates);
  } else if (feature.geometry.type === 'Point') {
    return feature.geometry.coordinates;
  }
  return getCoordinatesCentroid(getCoordinates(feature));
}

// https://stackoverflow.com/a/22796806
function getCoordinatesCentroid(arr: number[][]) {
  return arr.reduce(
    (x, y) => {
      return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
    },
    [0, 0],
  );
}
