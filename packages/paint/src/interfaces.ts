import type { Feature } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';

export type PaintType = 'circle' | 'path' | 'pin' | 'icon' | 'get-paint';

interface BasePaintTypes {
  type?: PaintType;
}

export interface BasePaint extends BasePaintTypes {
  color?: string | Expression;
  opacity?: number | Expression;
  fill?: boolean;
  fillColor?: string | Expression;
  fillOpacity?: number | Expression;
  stroke?: boolean;
  strokeColor?: string | Expression;
  strokeOpacity?: number | Expression;
  /** stroke width TODO: rename to width **/
  weight?: number | Expression;
  extrude3d?: number | Expression;
}

export interface CirclePaint extends BasePaint {
  type?: 'circle';
  radius?: number | Expression;
}

export interface PathPaint extends BasePaint {
  type?: 'path';
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
   * @defaultValue maki
   */
  iconfont?: 'maki' | 'mdi' | 'md' | 'fa';
  icon?: string | Expression | IconPaint;
}

export interface IconPaint extends BasePaintTypes {
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
export type IconOptions = IconPaint | PinPaint;

export type GetPaintFunction = (opt?: any) => VectorAdapterLayerPaint;

export interface GetCustomPaintOptions extends BasePaintTypes {
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
  | IconPaint
  | PinPaint
  | GetCustomPaintOptions;

export interface GetPaintCallback<F = Feature> {
  (feature: F): VectorAdapterLayerPaint;
  type?: PaintType;
}

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
  | 'get'
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
  | 'match';
// | 'coalesce'
// String
// | 'concat'
// | 'downcase'
// | 'is-supported-script'
// | 'resolved-locale'
// | 'upcase'

export type Expression = [ExpressionName, ...any[]];
