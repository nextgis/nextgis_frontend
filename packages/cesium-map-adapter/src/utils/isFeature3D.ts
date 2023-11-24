import type { Feature, Geometry, Position } from 'geojson';

export function isFeature3D(feature: Feature<Geometry>): boolean {
  if ('coordinates' in feature.geometry) {
    let position: Position | Position[] | Position[][] | Position[][][] =
      feature.geometry.coordinates;
    while (Array.isArray(position)) {
      const next = position[0];
      if (typeof next === 'number') {
        return position.length > 2;
      } else {
        position = next;
      }
    }
  }
  return false;
}
