import { decisionExpressions } from './expressions/decisionExpressions';
import { interpolationExpressions } from './expressions/interpolationExpressions';
import { lookupExpressions } from './expressions/lookupExpressions';
import { mathExpressions } from './expressions/mathExpressions';
import { stringExpressions } from './expressions/stringExpressions';
import { typeExpressions } from './expressions/typeExpressions';

import type {
  Data,
  Expression,
  ExpressionFunc,
  ExpressionName,
  SimpleType,
} from './interfaces';

export function isExpression(value: any): value is Expression {
  if (Array.isArray(value)) {
    const [lookup, ...cases] = value;
    const l = lookup as ExpressionName;
    return (
      typeof l === 'string' &&
      l !== 'literal' &&
      l in expressions &&
      cases.length > 0
    );
  }
  return false;
}

const expressions: { [key in ExpressionName]: ExpressionFunc } = {
  ...mathExpressions,
  ...typeExpressions,
  ...stringExpressions,
  ...lookupExpressions,
  ...decisionExpressions,
  ...interpolationExpressions,
};

export function evaluate<T extends SimpleType[] = SimpleType[], R = T[0]>(
  expression: Expression,
  data: Data = {},
): R {
  const [name, ...args] = expression;
  const expressionFun = expressions[name];
  if (expressionFun) {
    return expressionFun(
      args.map((arg) => () => (isExpression(arg) ? evaluate(arg, data) : arg)),
      data,
    );
  }
  throw new Error(`Expression "${name}" is not supported.`);
}
