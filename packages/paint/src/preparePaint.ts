/**
 * @module webmap
 */
import { featureFilter } from '@nextgis/properties-filter';
import { Feature } from 'geojson';
import {
  Paint,
  VectorAdapterLayerPaint,
  GeometryPaint,
  GetPaintFunction,
  GetCustomPaintOptions,
  PropertiesPaint,
  PropertyPaint,
} from './interfaces';
import { isPaintCallback, isPropertiesPaint, isPaint } from './typeHelpers';
import { createExpressionCallback } from './fromPaintExpression';

function updatePaintOptionFromCallback(
  paint: GetCustomPaintOptions,
  getPaintFunctions: { [name: string]: GetPaintFunction }
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
  propertiesPaint: PropertiesPaint
): GetPaintFunction {
  let mask: VectorAdapterLayerPaint = {};
  const paintsFilters: PropertyPaint[] = [];
  propertiesPaint.forEach((x) => {
    if (x) {
      if (Array.isArray(x)) {
        paintsFilters.push(x);
      } else {
        mask = x as VectorAdapterLayerPaint;
      }
    }
  });

  return (feature: Feature) => {
    const paint = paintsFilters.find((x) => featureFilter(feature, x[0]));
    if (paint) {
      return { ...mask, ...paint[1] };
    }
    return mask;
  };
}

export function preparePaint(
  paint: Paint,
  defaultPaint: GeometryPaint,
  getPaintFunctions: { [name: string]: GetPaintFunction }
): Paint {
  let newPaint: Paint | undefined;
  if (isPaintCallback(paint)) {
    return (feature: Feature) => {
      return preparePaint(
        paint(feature),
        defaultPaint,
        getPaintFunctions
      ) as VectorAdapterLayerPaint;
    };
  } else if (isPropertiesPaint(paint)) {
    return (feature: Feature) => {
      return preparePaint(
        createPropertiesPaint(paint)(feature),
        defaultPaint,
        getPaintFunctions
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
    const expressionCallback = createExpressionCallback(paint);
    if (expressionCallback) {
      return (feature: Feature) => {
        return preparePaint(
          expressionCallback(feature),
          defaultPaint,
          getPaintFunctions
        ) as VectorAdapterLayerPaint;
      };
    }

    newPaint = { ...paint };
    newPaint.fill = newPaint.fill !== undefined ? newPaint.fill : true;
    newPaint.stroke =
      newPaint.stroke !== undefined
        ? newPaint.stroke
        : !newPaint.fill || !!(newPaint.strokeColor || newPaint.strokeOpacity);
  }
  if (newPaint) {
    if (isPaintCallback(newPaint)) {
      return newPaint;
    } else if (isPaint(newPaint)) {
      newPaint = { ...defaultPaint, ...newPaint };
    }
  } else {
    newPaint = { ...defaultPaint };
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
