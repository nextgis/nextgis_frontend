import {GeoJSON} from 'geojson';

export function detectCrs(geojson: GeoJSON, projs: any): any;
export function reproject(geojson: GeoJSON, from: any, to: any, projs: any): GeoJSON;
export function reverse(geojson: GeoJSON): GeoJSON;
export function toWgs84(geojson: GeoJSON, from: any, projs: any): GeoJSON;


