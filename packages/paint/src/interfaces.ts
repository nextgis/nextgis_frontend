import { PropertiesFilter } from '@nextgis/properties-filter';
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

export type GeometryPaint = PathPaint & CirclePaint & PinPaint;

export interface PinPaint extends BasePaint {
  type?: 'pin';
  size?: number | Expression;
  symbol?: string | Expression;
  /**
   * TODO: make a selection of fonts with icons
   * Place font to assets and set ASSET_PATH local or from cdn
   *
   * https://github.com/CesiumGS/cesium/blob/master/Source/Core/PinBuilder.js
   * @default maki
   */
  iconfont?: 'maki' | 'mdi' | 'md' | 'fa';
  icon?: string | Expression | IconPaint;
}

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

export type PropertyPaint = [PropertiesFilter, VectorAdapterLayerPaint];

export type PropertiesPaint = [
  VectorAdapterLayerPaint | undefined,
  ...PropertyPaint[]
];

export type VectorAdapterLayerPaint =
  | CirclePaint
  | PathPaint
  | IconOptions
  | PinPaint
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
