import { EARTHS_RADIUS } from './constants';
import type { Position } from 'geojson';

const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;

export function getSquarePolygonCoordinates(
  lng: number,
  lat: number,
  halfSideLength = 10,
): Position[] {
  const rlat = (halfSideLength / EARTHS_RADIUS) * r2d;
  const rlng = rlat / Math.cos(lat * d2r);

  const topLeft: Position = [lng - rlng, lat + rlat];
  const topRight: Position = [lng + rlng, lat + rlat];
  const bottomRight: Position = [lng + rlng, lat - rlat];
  const bottomLeft: Position = [lng - rlng, lat - rlat];

  return [topLeft, topRight, bottomRight, bottomLeft, topLeft];

}
