import { PropertiesFilter } from './LayerAdapter';
import { Feature } from 'geojson';

export interface BasePaint {
  type?: string;
  color?: string;
  opacity?: number;
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  stroke?: boolean;
  strokeColor?: string;
  strokeOpacity?: number;
}

export interface CirclePaint extends BasePaint {
  type?: 'circle';
  radius?: number;
}

export interface PathPaint extends BasePaint {
  type?: 'path';
  weight?: number;
}

export type GeometryPaint = PathPaint & CirclePaint;

export interface IconPaint {
  type: 'icon';
  className?: string;
  html?: string;
  svg?: HTMLElement;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}

/**
 * @deprecated use IconPaint instead
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IconOptions extends IconPaint {}

export type GetPaintFunction = (opt?: any) => VectorAdapterLayerPaint;

export interface GetCustomPaintOptions {
  type: 'get-paint';
  from: string | GetPaintFunction;
  options?: any;
}

export function isPropertiesPaint(paint: Paint): paint is PropertiesPaint {
  if (Array.isArray(paint)) {
    return true;
  }
  return false;
}

export function isPaint(paint: Paint): paint is VectorAdapterLayerPaint {
  if (Object.prototype.toString.call(paint) === '[object Object]') {
    return true;
  }
  return false;
}

export function isPaintCallback(paint: Paint): paint is GetPaintCallback {
  if (typeof paint === 'function') {
    return true;
  }
  return false;
}

export type PropertyPaint = [PropertiesFilter, VectorAdapterLayerPaint];

export type PropertiesPaint = [
  VectorAdapterLayerPaint | undefined,
  ...PropertyPaint[]
];

export type VectorAdapterLayerPaint =
  | CirclePaint
  | PathPaint
  | IconOptions
  | GetCustomPaintOptions;

export type GetPaintCallback<F = Feature> = (
  feature: F
) => VectorAdapterLayerPaint;

export type Paint =
  | VectorAdapterLayerPaint
  | GetPaintCallback
  | PropertiesPaint;
