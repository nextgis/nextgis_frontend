import { PropertiesFilter } from './LayerAdapter';
import { Feature } from 'geojson';

export interface BasePaint {
  type?: string;
  color?: string | Expression;
  opacity?: number | Expression;
  fill?: boolean;
  fillColor?: string | Expression;
  fillOpacity?: number | Expression;
  stroke?: boolean;
  strokeColor?: string | Expression;
  strokeOpacity?: number | Expression;
}

export interface CirclePaint extends BasePaint {
  type?: 'circle';
  radius?: number | Expression;
}

export interface PathPaint extends BasePaint {
  type?: 'path';
  weight?: number | Expression;
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

export function isBasePaint(paint: Paint): paint is GeometryPaint {
  if (isPaint(paint)) {
    if (paint.type === 'get-paint' || paint.type === 'icon') {
      return false;
    }
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

// MAPBOX
export type ExpressionName =
  // Types
  // | 'array'
  // | 'boolean'
  // | 'collator'
  // | 'format'
  // | 'literal'
  // | 'number'
  // | 'object'
  // | 'string'
  // | 'to-boolean'
  // | 'to-color'
  // | 'to-number'
  // | 'to-string'
  // | 'typeof'
  // Feature data
  // | 'feature-state'
  // | 'geometry-type'
  // | 'id'
  // | 'line-progress'
  // | 'properties'
  // Lookup
  // | 'at'
  'get';
// | 'has'
// | 'length'
// Decision
// | '!'
// | '!='
// | '<'
// | '<='
// | '=='
// | '>'
// | '>='
// | 'all'
// | 'any'
// | 'case'
// | 'match'
// | 'coalesce'
// String
// | 'concat'
// | 'downcase'
// | 'is-supported-script'
// | 'resolved-locale'
// | 'upcase'

export type Expression = [ExpressionName, ...any[]];

export function isExpression(value: any): value is Expression {
  if (Array.isArray(value)) {
    return true;
  }
  return false;
}
