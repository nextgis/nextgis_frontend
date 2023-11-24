import { featureFilter } from '@nextgis/properties-filter';

import { createExpressionCallback } from './fromPaintExpression';
import { isPaintCallback, isPropertiesPaint } from './typeHelpers';

import type {
  GeometryPaint,
  GetCustomPaintOptions,
  GetPaintCallback,
  GetPaintFunction,
  Paint,
  PropertiesPaint,
  PropertyPaint,
  VectorAdapterLayerPaint,
} from './interfaces';
import type { Feature } from 'geojson';

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

function expressionCallback({
  paint,
  defaultPaint,
}: PreparePaintOptions): Paint | VectorAdapterLayerPaint {
  const expressionCallback = createExpressionCallback(paint);
  if (expressionCallback) {
    const expressionPaintCb = (feature: Feature) => {
      return preparePaint({
        paint: expressionCallback(feature),
        defaultPaint,
      }) as VectorAdapterLayerPaint;
    };
    expressionPaintCb.paint = finalizePaint({ paint, defaultPaint });
    return expressionPaintCb as VectorAdapterLayerPaint;
  }
  return finalizePaint({ paint, defaultPaint });
}

function finalizePaint({ paint, defaultPaint }: PreparePaintOptions): Paint {
  let newPaint: Paint = { ...defaultPaint };
  newPaint = { ...newPaint, ...paint } as GeometryPaint;
  newPaint.fill = newPaint.fill ?? true;
  newPaint.stroke =
    newPaint.stroke !== undefined
      ? newPaint.stroke
      : !newPaint.fill || !!(newPaint.strokeColor || newPaint.strokeOpacity);
  return newPaint;
}

export interface PreparePaintOptions {
  paint: Paint;
  defaultPaint?: GeometryPaint;
  getPaintFunctions?: { [name: string]: GetPaintFunction };
}

export function preparePaint({
  paint,
  defaultPaint,
  getPaintFunctions,
}: PreparePaintOptions): Paint {
  if (!paint) {
    throw new Error('paint is empty');
  }
  let newPaint: Paint = { ...defaultPaint };
  if (isPaintCallback(paint)) {
    const getPaintFunction: GetPaintCallback = (feature: Feature) => {
      const getPaint = preparePaint({
        paint: paint(feature),
        defaultPaint,
        getPaintFunctions,
      }) as VectorAdapterLayerPaint;
      getPaint.type = paint.type;
      return getPaint;
    };
    getPaintFunction.type = paint.type;
    return getPaintFunction;
  } else if (isPropertiesPaint(paint)) {
    return (feature: Feature) => {
      return preparePaint({
        paint: createPropertiesPaint(paint)(feature),
        defaultPaint,
        getPaintFunctions,
      }) as VectorAdapterLayerPaint;
    };
  } else if (paint.type === 'get-paint') {
    const getPaint = updatePaintOptionFromCallback(paint, getPaintFunctions);
    if (getPaint) {
      newPaint = preparePaint({
        paint: getPaint,
        defaultPaint,
        getPaintFunctions,
      });
    }
  } else if (paint.type === 'icon') {
    return paint;
  } else {
    newPaint = expressionCallback({ paint, defaultPaint });
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
