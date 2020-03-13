import { Feature } from 'geojson';
import {
  VectorAdapterLayerPaint,
  GetPaintCallback,
  Expression
} from './interfaces';
import { isExpression } from './typeHelpers';

function get(feature: Feature, field: string) {
  return feature.properties && feature.properties[field];
}

type propertyExpressionCb = (
  feature: Feature
) => string | number | boolean | undefined;

function createPropertyExpressionCb(
  expression: Expression
): propertyExpressionCb {
  return (feature: Feature) => {
    const name = expression[0];
    if (name === 'get' && expression[1]) {
      return get(feature, expression[1]);
    }
    return undefined;
  };
}

const excludeExpressionList = ['iconSize', 'iconAnchor'];

export function createExpressionCallback(
  paint: VectorAdapterLayerPaint
): GetPaintCallback | undefined {
  let withExpression = false;
  const expressions: {
    [key: string]: propertyExpressionCb;
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
