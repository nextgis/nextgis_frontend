import { EARTHS_RADIUS } from './constants';
import type { Feature, Polygon, Position } from 'geojson';

const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees

export function getCirclePolygonCoordinates(
  lng: number,
  lat: number,
  radius = 10,
  points = 6,
): Position[] {
  // find the radius in lat/lon
  const rlat = (radius / EARTHS_RADIUS) * r2d;
  const rlng = rlat / Math.cos(lat * d2r);

  const extp = [];
  for (let i = 0; i < points + 1; i++) {
    // one extra here makes sure we connect the

    const theta = Math.PI * (i / (points / 2));
    const ex = lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
    const ey = lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
    extp.push([ex, ey]);
  }

  return extp;
}

export function getCircleFeature(
  lng: number,
  lat: number,
  radius = 10,
  points = 6,
): Feature<Polygon> {
  const polygon = getCirclePolygonCoordinates(lng, lat, radius, points);
  const feature: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [polygon],
    },
  };
  return feature;
}
