## API Report File for "@nextgis/paint"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { Feature } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';

// Warning: (ae-forgotten-export) The symbol "BasePaintTypes" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export interface BasePaint extends BasePaintTypes {
    // (undocumented)
    color?: string | Expression;
    // (undocumented)
    extrude3d?: number | Expression;
    // (undocumented)
    fill?: boolean;
    // (undocumented)
    fillColor?: string | Expression;
    // (undocumented)
    fillOpacity?: number | Expression;
    // (undocumented)
    opacity?: number | Expression;
    // (undocumented)
    stroke?: boolean;
    // (undocumented)
    strokeColor?: string | Expression;
    // (undocumented)
    strokeOpacity?: number | Expression;
    weight?: number | Expression;
}

// @public (undocumented)
export interface CirclePaint extends BasePaint {
    // (undocumented)
    radius?: number | Expression;
    // (undocumented)
    type?: 'circle';
}

// @public (undocumented)
export function createExpressionCallback(paint: VectorAdapterLayerPaint): GetPaintCallback | undefined;

// @public (undocumented)
export type Expression = [ExpressionName, ...any[]];

// @public (undocumented)
export type ExpressionName = 'get' | 'match';

// @public (undocumented)
export type GeometryPaint = PathPaint & CirclePaint & PinPaint;

// @public (undocumented)
export interface GetCustomPaintOptions extends BasePaintTypes {
    // (undocumented)
    from: string | GetPaintFunction;
    // (undocumented)
    options?: any;
    // (undocumented)
    type: 'get-paint';
}

// @public (undocumented)
export interface GetPaintCallback<F extends Feature = Feature> {
    // (undocumented)
    (feature: F): VectorAdapterLayerPaint;
    // (undocumented)
    paint?: CirclePaint | PathPaint | PinPaint;
    // (undocumented)
    type?: PaintType;
}

// @public (undocumented)
export type GetPaintFunction = (opt?: any) => VectorAdapterLayerPaint;

// @public @deprecated (undocumented)
export type IconOptions = IconPaint | PinPaint;

// @public (undocumented)
export interface IconPaint extends BasePaintTypes {
    // (undocumented)
    className?: string;
    // (undocumented)
    html?: string;
    // (undocumented)
    iconAnchor?: [number, number];
    // (undocumented)
    iconSize?: [number, number];
    // (undocumented)
    svg?: HTMLElement;
    // (undocumented)
    type: 'icon';
}

// @public (undocumented)
export function isBasePaint(paint: Paint): paint is GeometryPaint;

// @public (undocumented)
export function isExpression(value: unknown): value is Expression;

// @public (undocumented)
export function isIcon(paint: IconPaint): paint is IconPaint;

// @public (undocumented)
export function isPaint(paint: Paint): paint is VectorAdapterLayerPaint;

// @public (undocumented)
export function isPaintCallback(paint: Paint): paint is GetPaintCallback;

// @public (undocumented)
export function isPropertiesPaint(paint: Paint): paint is PropertiesPaint;

// Warning: (ae-forgotten-export) The symbol "Properties" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export type Paint<F extends Feature = Feature, P extends Properties | null = F['properties']> = VectorAdapterLayerPaint | GetPaintCallback<F> | PropertiesPaint<P extends null ? Properties : P>;

// @public (undocumented)
export type PaintType = 'circle' | 'path' | 'pin' | 'icon' | 'get-paint';

// @public (undocumented)
export interface PathPaint extends BasePaint {
    // (undocumented)
    type?: 'path';
}

// @public (undocumented)
export interface PinPaint extends BasePaint {
    // (undocumented)
    icon?: string | Expression | IconPaint;
    iconfont?: 'maki' | 'mdi' | 'md' | 'fa';
    // (undocumented)
    size?: number | Expression;
    // (undocumented)
    symbol?: string | Expression;
    // (undocumented)
    type?: 'pin';
}

// @public (undocumented)
export function preparePaint(paint: Paint, defaultPaint?: GeometryPaint, getPaintFunctions?: {
    [name: string]: GetPaintFunction;
}): Paint;

// @public (undocumented)
export type PropertiesPaint<P extends Properties = Properties> = [
VectorAdapterLayerPaint | undefined,
...PropertyPaint<P>[]
];

// @public (undocumented)
export type PropertyPaint<P extends Properties = Properties> = [
PropertiesFilter<P>,
VectorAdapterLayerPaint
];

// @public (undocumented)
export type VectorAdapterLayerPaint = CirclePaint | PathPaint | IconPaint | PinPaint | GetCustomPaintOptions;

// (No @packageDocumentation comment for this package)

```