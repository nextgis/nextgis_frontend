import { LngLatBoundsArray } from '../interfaces/BaseTypes';
import { Feature, Polygon } from 'geojson';

export function getBoundsPolygon(b: LngLatBoundsArray): Feature<Polygon> {
  const westNorth = [b[0], b[1]];
  const eastNorth = [b[2], b[1]];
  const eastSouth = [b[2], b[3]];
  const westSouth = [b[0], b[3]];

  const feature: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[westNorth, eastNorth, eastSouth, westSouth, westNorth]]
    }
  };
  return feature;
}
