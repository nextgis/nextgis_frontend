import { typeExpressions } from './expressions/typeExpressions';
import { mathExpressions } from './expressions/mathExpressions';
import type {
  Data,
  SimpleType,
  Expression,
  ExpressionFunc,
  ExpressionName,
} from './interfaces';
import { lookupExpressions } from './expressions/lookupExpressions';
import { decisionExpressions } from './expressions/decisionExpressions';
import { interpolationExpressions } from './expressions/interpolationExpressions';

export function isExpression(value: any): value is Expression {
  if (Array.isArray(value)) {
    const [lookup, ...cases] = value;
    return (
      typeof lookup === 'string' && lookup in expressions && cases.length > 0
    );
  }
  return false;
}

function step(args: any[]) {
  const [input, defaultValue, ...stops] = args;

  if (typeof input !== 'number') {
    return undefined;
  }

  for (let i = 0; i < stops.length - 2; i += 2) {
    const stopInput = stops[i];
    const stopOutput = stops[i + 1];
    const nextStopInput = stops[i + 2];

    if (input >= stopInput && input < nextStopInput) {
      return stopOutput;
    }
  }

  if (input >= stops[stops.length - 2]) {
    return stops[stops.length - 1];
  }

  return defaultValue;
}

const expressions: { [key in ExpressionName]: ExpressionFunc } = {
  ...mathExpressions,
  ...typeExpressions,
  ...lookupExpressions,
  ...decisionExpressions,
  ...interpolationExpressions,
};

export function evaluate<T extends SimpleType = SimpleType>(
  data: Data,
  expression: Expression,
): T | undefined {
  const [name, ...args] = expression;
  const expressionFun = expressions[name];
  if (expressionFun) {
    return expressionFun(
      args.map((arg) => (isExpression(arg) ? evaluate(data, arg) : arg)),
      data,
    );
  }
  return undefined;
}
