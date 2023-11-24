import { type Expression, evaluate, isExpression } from '@nextgis/expression';

import type { GetPaintCallback, VectorAdapterLayerPaint } from './interfaces';
import type { Feature } from 'geojson';

type PropertyExpressionCb = (feature: Feature) => ReturnType<typeof evaluate>;

function createPropertyExpressionCb(
  expression: Expression,
): PropertyExpressionCb {
  return (feature: Feature) => {
    const properties = feature.properties;
    if (properties) {
      return evaluate(expression, properties);
    }
    return false;
  };
}

const excludeExpressionList = ['iconSize', 'iconAnchor'];

export function createExpressionCallback(
  paint: Record<string, any>,
): GetPaintCallback | undefined {
  let withExpression = false;
  const expressions: {
    [key: string]: PropertyExpressionCb;
  } = {};
  for (const p in paint) {
    if (excludeExpressionList.indexOf(p) === -1) {
      const p_ = p as keyof VectorAdapterLayerPaint;
      const val = paint[p_];
      if (isExpression(val)) {
        withExpression = true;
        expressions[p_] = createPropertyExpressionCb(val);
      }
    }
  }
  if (withExpression) {
    return (feature: Feature) => {
      const fromCb: any = {};
      for (const p in expressions) {
        fromCb[p] = expressions[p](feature);
      }
      return { ...paint, ...fromCb };
    };
  }
  return;
}
