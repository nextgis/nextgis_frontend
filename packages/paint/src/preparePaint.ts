import { featureFilter } from '@nextgis/properties-filter';

import { createExpressionCallback } from './fromPaintExpression';
import { isPaintCallback, isPropertiesPaint } from './typeHelpers';

import type { Feature } from 'geojson';
import type {
  Paint,
  PropertyPaint,
  GeometryPaint,
  PropertiesPaint,
  GetPaintCallback,
  GetPaintFunction,
  GetCustomPaintOptions,
  VectorAdapterLayerPaint,
} from './interfaces';

function updatePaintOptionFromCallback(
  paint: GetCustomPaintOptions,
  getPaintFunctions?: { [name: string]: GetPaintFunction },
): VectorAdapterLayerPaint | undefined {
  if (typeof paint.from === 'function') {
    return paint.from(paint.options);
  } else if (typeof paint.from === 'string' && getPaintFunctions) {
    const from = getPaintFunctions[paint.from];
    if (from) {
      return from(paint.options);
    }
  }
}

function createPropertiesPaint(
  propertiesPaint: PropertiesPaint,
): GetPaintFunction {
  let mask: VectorAdapterLayerPaint = {};
  const paintsFilters: PropertyPaint[] = [];
  for (const p of propertiesPaint) {
    if (p) {
      if (Array.isArray(p)) {
        paintsFilters.push(p);
      } else {
        mask = p as VectorAdapterLayerPaint;
      }
    }
  }

  return (feature: Feature) => {
    const paint = paintsFilters.find((x) => featureFilter(feature, x[0]));
    if (paint) {
      return { ...mask, ...paint[1] };
    }
    return mask;
  };
}

export function expressionCallback<P extends Record<string, any> = Record<string, any>>(
  paint: P,
  defaultPaint?: P,
  getPaintFunctions?: Record<string, GetPaintFunction>,
) {
  const expressionCallback = createExpressionCallback(paint);
  if (expressionCallback) {
    const expressionPaintCb = (feature: Feature) => {
      return preparePaint(
        expressionCallback(feature),
        defaultPaint,
        getPaintFunctions,
      ) as VectorAdapterLayerPaint;
    };
    expressionPaintCb.paint = paint;
    return expressionPaintCb;
  }
  let newPaint: Paint = { ...defaultPaint };
  newPaint = { ...newPaint, ...paint };
  newPaint.fill = newPaint.fill !== undefined ? newPaint.fill : true;
  newPaint.stroke =
    newPaint.stroke !== undefined
      ? newPaint.stroke
      : !newPaint.fill || !!(newPaint.strokeColor || newPaint.strokeOpacity);
  return newPaint;
}

export function preparePaint(
  paint: Paint,
  defaultPaint?: GeometryPaint,
  getPaintFunctions?: { [name: string]: GetPaintFunction },
): Paint {
  if (!paint) {
    throw new Error('paint is empty');
  }
  let newPaint: Paint = { ...defaultPaint };
  if (isPaintCallback(paint)) {
    const getPaintFunction: GetPaintCallback = (feature: Feature) => {
      const getPaint = preparePaint(
        paint(feature),
        defaultPaint,
        getPaintFunctions,
      ) as VectorAdapterLayerPaint;
      getPaint.type = paint.type;
      return getPaint;
    };
    getPaintFunction.type = paint.type;
    return getPaintFunction;
  } else if (isPropertiesPaint(paint)) {
    return (feature: Feature) => {
      return preparePaint(
        createPropertiesPaint(paint)(feature),
        defaultPaint,
        getPaintFunctions,
      ) as VectorAdapterLayerPaint;
    };
  } else if (paint.type === 'get-paint') {
    const getPaint = updatePaintOptionFromCallback(paint, getPaintFunctions);
    if (getPaint) {
      newPaint = preparePaint(getPaint, defaultPaint, getPaintFunctions);
    }
  } else if (paint.type === 'icon') {
    return paint;
  } else {
    newPaint = expressionCallback(paint, defaultPaint, getPaintFunctions);
  }

  if (isPaintCallback(newPaint)) {
    return newPaint;
  }

  if ('color' in newPaint) {
    if (!newPaint.strokeColor) {
      newPaint.strokeColor = newPaint.color;
    }
    if (!newPaint.fillColor) {
      newPaint.fillColor = newPaint.color;
    }
  }
  if ('opacity' in newPaint) {
    if (newPaint.strokeOpacity === undefined) {
      newPaint.strokeOpacity = newPaint.opacity;
    }
    if (newPaint.fillOpacity === undefined) {
      newPaint.fillOpacity = newPaint.opacity;
    }
  }

  return newPaint;
}
