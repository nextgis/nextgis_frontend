import type { Feature } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import { Expression } from '@nextgis/expression';

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

type Properties = { [name: string]: any };

export type PropertyPaint<P extends Properties = Properties> = [
  PropertiesFilter<P>,
  VectorAdapterLayerPaint,
];

export type PropertiesPaint<P extends Properties = Properties> = [
  VectorAdapterLayerPaint | undefined,
  ...PropertyPaint<P>[],
];

export type VectorAdapterLayerPaint =
  | CirclePaint
  | PathPaint
  | IconPaint
  | PinPaint
  | GetCustomPaintOptions;

export interface GetPaintCallback<F extends Feature = Feature> {
  (feature: F): VectorAdapterLayerPaint;
  type?: PaintType;
  paint?: CirclePaint | PathPaint | PinPaint;
}

export type Paint<
  F extends Feature = Feature,
  P extends Properties | null = F['properties'],
> =
  | VectorAdapterLayerPaint
  | GetPaintCallback<F>
  | PropertiesPaint<P extends null ? Properties : P>;

// 3D Paint

export type Paint3DType = 'ellipsoid' | 'sphere';

export type VectorAdapterLayerPaint3D = Sphere3DPaint | Ellipsoid3DPaint;

export interface Base3DPaint {
  type?: Paint3DType;
  color?: string | Expression;
  fill?: boolean;
  fillColor?: string | Expression;
  stroke?: boolean;
  strokeWidth?: number | Expression;
  strokeColor?: string | Expression;
}

export interface Ellipsoid3DPaint extends Base3DPaint {
  type: 'ellipsoid';
  length: number;
  width: number;
  height: number;
}

export interface Sphere3DPaint extends Base3DPaint {
  type: 'sphere';
  radius: number;
}

export interface GetPaint3DCallback<F extends Feature = Feature> {
  (feature: F): VectorAdapterLayerPaint;
  type?: Paint3DType;
  paint?: VectorAdapterLayerPaint3D;
}

export type PropertiesPaint3D<P extends Properties = Properties> = [
  VectorAdapterLayerPaint3D | undefined,
  ...PropertyPaint<P>[],
];

export type PropertyPaint3D<P extends Properties = Properties> = [
  PropertiesFilter<P>,
  VectorAdapterLayerPaint3D,
];

export type Paint3D<
  F extends Feature = Feature,
  P extends Properties | null = F['properties'],
> =
  | VectorAdapterLayerPaint3D
  | GetPaintCallback<F>
  | PropertyPaint3D<P extends null ? Properties : P>;
