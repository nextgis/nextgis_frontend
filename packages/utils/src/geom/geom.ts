import { LngLatArray, LatLng } from './interfaces';

export function latLngToLngLatArray(latLng: LatLng): LngLatArray {
  return [latLng.lng, latLng.lat];
}

export function lngLatArrayToLatLng(coord: LngLatArray): LatLng {
  return { lat: coord[1], lng: coord[0] };
}

const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees
/**
 * Radius of the earth in kilometers
 */
export const EARTHS_RADIUS = 6371;

export function getCirclePoly(
  lng: number,
  lat: number,
  radius = 10,
  points = 6
): number[][] {
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

  // add the circle to the map
  return extp;
}

export function degrees2meters(lng: number, lat: number): [number, number] {
  lat = lat > 85.06 ? 85.06 : lat < -85.06 ? -85.06 : lat;

  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return [x, y];
}

export function meters2degress(x: number, y: number): LngLatArray {
  const lon = (x * 180) / 20037508.34;
  const lat =
    (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
  return [lon, lat];
}

// export function degrees2meters2(lon: number, lat: number): [number, number] {
//   const radius = 6378137.0;
//   const x = (radius * lon * Math.PI) / 180.0;
//   const y =
//     radius * Math.log(Math.tan(Math.PI / 4.0 + (lat * Math.PI) / 360.0));
//   return [x, y];
// }

// export function meters2degress2(x: number, y: number): LngLatArray {
//   const radius = 6378137.0;
//   const lon = (180 / Math.PI) * (x / radius);
//   const lat = (360 / Math.PI) * (Math.atan(Math.exp(y / radius)) - Math.PI / 4);
//   return [lon, lat];
// }

// const lon = -77.035974;
// const lat = 38.898717;

// console.log(degrees2meters(lon, lat), degrees2meters2(lon, lat));

// const x = -8575605.398443861;
// const y = 4707174.018280405;

// console.log(meters2degress(x, y), meters2degress2(x, y));
