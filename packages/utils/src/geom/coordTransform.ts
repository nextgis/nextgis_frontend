import type { LngLatArray } from './interfaces';

export function degrees2meters(lng: number, lat: number): [number, number] {
  lat = lat > 85.06 ? 85.06 : lat < -85.06 ? -85.06 : lat;

  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return [x, y];
}

export function meters2degrees(x: number, y: number): LngLatArray {
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
