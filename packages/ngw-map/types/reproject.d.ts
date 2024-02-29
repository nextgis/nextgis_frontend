import type { GeoJsonObject } from 'geojson';

export function detectCrs(geojson: GeoJsonObject, projs: any): any;
export function reproject(
  geojson: GeoJsonObject,
  from: any,
  to: any,
  projs: any,
): GeoJsonObject;
export function reverse(geojson: GeoJsonObject): GeoJsonObject;
