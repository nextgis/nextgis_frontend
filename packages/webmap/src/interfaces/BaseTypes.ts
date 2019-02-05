export type Type<T> = new (...args: any[]) => T;

export interface LatLng {
  lat: number;
  lng: number;
}

// extent_left, extent_bottom, extent_right, extent_top
export type LayerExtent = [number, number, number, number];

export type MapCenter = [number, number];

export interface Pixel { top: number; left: number; right?: number; bottom?: number; }
