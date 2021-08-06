import type { Feature, Polygon } from 'geojson';
import type { LngLatBoundsArray } from './interfaces';

export function getBoundsPolygon(b: LngLatBoundsArray): Polygon {
  const polygon: Polygon = {
    type: 'Polygon',
    coordinates: [getBoundsCoordinates(b)],
  };
  return polygon;
}

export function getBoundsCoordinates(b: LngLatBoundsArray): number[][] {
  const westNorth = [b[0], b[1]];
  const eastNorth = [b[2], b[1]];
  const eastSouth = [b[2], b[3]];
  const westSouth = [b[0], b[3]];

  return [westNorth, eastNorth, eastSouth, westSouth, westNorth];
}

export function getBoundsFeature(b: LngLatBoundsArray): Feature<Polygon> {
  const feature: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: getBoundsPolygon(b),
  };
  return feature;
}
