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

function match(data: Data, args: any[]) {
  const [lookup, ...cases] = args;
  let property = lookup;
  if (isExpression(lookup)) {
    property = evaluate(data, lookup);
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

function caseFunc(data: Data, args: any[]): any {
  let defaultVal;
  let conditionsAndValues = args;

  if (args.length % 2 !== 0) {
    defaultVal = args[args.length - 1];
    conditionsAndValues = args.slice(0, -1);
  }

  for (let i = 0; i < conditionsAndValues.length; i += 2) {
    const condition = conditionsAndValues[i];
    const value = conditionsAndValues[i + 1];
    if (isExpression(condition)) {
      if (evaluate(data, condition)) {
        return value;
      }
    } else if (condition) {
      return value;
    }
  }
  return defaultVal;
}

function step(data: Data, args: any[]) {
  const [input, defaultValue, ...stops] = args;
  let inputValue;
  if (isExpression(input)) {
    inputValue = evaluate(data, input);
  } else {
    inputValue = input;
  }

  if (typeof inputValue !== 'number') {
    return undefined;
  }

  for (let i = 0; i < stops.length - 2; i += 2) {
    const stopInput = stops[i];
    const stopOutput = stops[i + 1];
    const nextStopInput = stops[i + 2];

    if (inputValue >= stopInput && inputValue < nextStopInput) {
      return stopOutput;
    }
  }

  if (inputValue >= stops[stops.length - 2]) {
    return stops[stops.length - 1];
  }

  return defaultValue;
}

function coalesce(data: Data, args: any[]): any {
  for (const arg of args) {
    const evaluatedArg = evaluateArg(data, arg);
    if (evaluatedArg !== null && evaluatedArg !== undefined) {
      return evaluatedArg;
    }
  }
  return undefined;
}

function not(data: Data, args: any[]): boolean {
  const [expr] = args;
  if (isExpression(expr)) {
    return !evaluate(data, expr);
  }
  return !expr;
}

function notEqual(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) !== evaluateArg(data, right);
}

function lessThan(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) < evaluateArg(data, right);
}

function lessThanOrEqual(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) <= evaluateArg(data, right);
}

function equal(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) === evaluateArg(data, right);
}

function greaterThan(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) > evaluateArg(data, right);
}

function greaterThanOrEqual(data: Data, args: any[]): boolean {
  const [left, right] = args;
  return evaluateArg(data, left) >= evaluateArg(data, right);
}

function all(data: Data, args: any[]): boolean {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!evaluateArg(data, arg)) {
      return false;
    }
  }
  return true;
}

function any(data: Data, args: any[]): boolean {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (evaluateArg(data, arg)) {
      return true;
    }
  }
  return false;
}

export function evaluateArg(data: Data, arg: any): any {
  if (isExpression(arg)) {
    return evaluate(data, arg);
  }
  return arg;
}

const expressions: { [key in ExpressionName]: ExpressionFunc } = {
  ...mathExpressions,
  ...typeExpressions,
  ...lookupExpressions,
  step,
  match,
  case: caseFunc,
  coalesce: coalesce,
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

export function evaluate(data: Data, expression: Expression): SimpleType {
  const [name, ...args] = expression;
  const expressionFun = expressions[name];
  if (expressionFun) {
    return expressionFun(data, args);
  }
  return undefined;
}
