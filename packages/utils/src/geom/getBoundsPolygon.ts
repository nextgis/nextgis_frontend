import { Feature, Polygon } from 'geojson';
import { LngLatBoundsArray } from './interfaces';

/**
 * @public
 */
export function getBoundsPolygon(b: LngLatBoundsArray): Polygon {
  const westNorth = [b[0], b[1]];
  const eastNorth = [b[2], b[1]];
  const eastSouth = [b[2], b[3]];
  const westSouth = [b[0], b[3]];

  const polygon: Polygon = {
    type: 'Polygon',
    coordinates: [[westNorth, eastNorth, eastSouth, westSouth, westNorth]],
  };
  return polygon;
}

/**
 * @public
 */
export function getBoundsFeature(b: LngLatBoundsArray): Feature<Polygon> {
  const feature: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: getBoundsPolygon(b),
  };
  return feature;
}
