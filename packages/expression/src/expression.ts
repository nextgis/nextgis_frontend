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

export function isExpression(value: any): value is Expression {
  if (Array.isArray(value)) {
    const [lookup, ...cases] = value;
    return (
      typeof lookup === 'string' && lookup in expressions && cases.length > 0
    );
  }
  return false;
}

function match(args: any[]) {
  const [lookup, ...cases] = args;
  // remove last odd item from cases array
  const defValue = cases.splice(-1, cases.length % 2)[0];
  for (let fry = 0; fry < cases.length - 1; fry += 2) {
    const key = cases[fry];
    if (key === lookup) {
      return cases[fry + 1];
    }
  }
  return defValue;
}

function caseFunc(args: any[]): any {
  let defaultVal;
  let conditionsAndValues = args;

  if (args.length % 2 !== 0) {
    defaultVal = args[args.length - 1];
    conditionsAndValues = args.slice(0, -1);
  }

  for (let i = 0; i < conditionsAndValues.length; i += 2) {
    const condition = conditionsAndValues[i];
    const value = conditionsAndValues[i + 1];
    if (condition) {
      return value;
    }
  }
  return defaultVal;
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

function coalesce(args: any[]): any {
  for (const arg of args) {
    if (arg !== null && arg !== undefined) {
      return arg;
    }
  }
  return undefined;
}

function not(args: any[]): boolean {
  const [expr] = args;
  return !expr;
}

function notEqual(args: any[]): boolean {
  const [left, right] = args;
  return left !== right;
}

function lessThan(args: any[]): boolean {
  const [left, right] = args;
  return left < right;
}

function lessThanOrEqual(args: any[]): boolean {
  const [left, right] = args;
  return left <= right;
}

function equal(args: any[]): boolean {
  const [left, right] = args;
  return left === right;
}

function greaterThan(args: any[]): boolean {
  const [left, right] = args;
  return left > right;
}

function greaterThanOrEqual(args: any[]): boolean {
  const [left, right] = args;
  return left >= right;
}

function all(args: any[]): boolean {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) {
      return false;
    }
  }
  return true;
}

function any(args: any[]): boolean {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) {
      return true;
    }
  }
  return false;
}

const expressions: { [key in ExpressionName]: ExpressionFunc } = {
  ...mathExpressions,
  ...typeExpressions,
  ...lookupExpressions,
  step,
  match,
  case: caseFunc,
  coalesce,
  '!': not,
  '!=': notEqual,
  '<': lessThan,
  '<=': lessThanOrEqual,
  '==': equal,
  '>': greaterThan,
  '>=': greaterThanOrEqual,
  all: all,
  any: any,
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
