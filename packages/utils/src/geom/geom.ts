import type { LatLng, LngLatArray } from './interfaces';

export function latLngToLngLatArray(latLng: LatLng): LngLatArray {
  return [latLng.lng, latLng.lat];
}

export function lngLatArrayToLatLng(coord: LngLatArray): LatLng {
  return { lat: coord[1], lng: coord[0] };
}
