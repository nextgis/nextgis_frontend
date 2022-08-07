import { isExpression } from './typeHelpers';

import type { Feature } from 'geojson';
import type {
  VectorAdapterLayerPaint,
  GetPaintCallback,
  Expression,
  ExpressionName,
} from './interfaces';

type ExpressionFun = (feature: Feature, args: any[]) => SimpleType;

function get(feature: Feature, args: any[]) {
  const field = args[0];
  return feature.properties && feature.properties[field];
}

function match(feature: Feature, args: any[]) {
  const [lookup, ...cases] = args;
  let property = lookup;
  if (Array.isArray(lookup)) {
    property = featureExpression(feature, lookup as Expression);
  }
  // remove last odd item from cases array
  const defValue = cases.splice(-1, cases.length % 2)[0];
  for (let fry = 0; fry < cases.length - 1; fry += 2) {
    const key = cases[fry];
    if (key === property) {
      return cases[fry + 1];
    }
  }
  return defValue;
}

const expressions: { [key in ExpressionName]: ExpressionFun } = {
  get,
  match,
};

type SimpleType = string | number | boolean | undefined;

type PropertyExpressionCb = (feature: Feature) => SimpleType;

function featureExpression(feature: Feature, expression: Expression) {
  const [name, ...args] = expression;
  const expressionFun = expressions[name];
  if (expressionFun) {
    return expressionFun(feature, args);
  }
  return undefined;
}

function createPropertyExpressionCb(
  expression: Expression,
): PropertyExpressionCb {
  return (feature: Feature) => {
    return featureExpression(feature, expression);
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
