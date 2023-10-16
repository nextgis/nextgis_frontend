import e from '../utils/evaluateArgs';
import type { DecisionExpressionName, ExpressionCbFunc } from '../interfaces';

function not([expr]: [boolean]): boolean {
  return !expr;
}

function notEqual([a, b]: [value1: any, value2: any]): boolean {
  return a !== b;
}

function lessThan([left, right]: [value1: any, value2: any]): boolean {
  return left < right;
}

function lessThanOrEqual([left, right]: [value1: any, value2: any]): boolean {
  return left <= right;
}

function equal([left, right]: [value1: any, value2: any]): boolean {
  return left === right;
}

function greaterThan([left, right]: [value1: any, value2: any]): boolean {
  return left > right;
}

function greaterThanOrEqual([left, right]: [
  value1: any,
  value2: any,
]): boolean {
  return left >= right;
}

const coalesce: ExpressionCbFunc<any[], any> = (args) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]();
    if (arg !== null && arg !== undefined) {
      return arg;
    }
  }
  return null;
};

const all: ExpressionCbFunc<any[], boolean> = (args) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]();
    if (!arg) {
      return false;
    }
  }
  return true;
};

const any: ExpressionCbFunc<any[], boolean> = (args) => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]();
    if (arg) {
      return true;
    }
  }
  return false;
};

const match: ExpressionCbFunc<any[]> = (args) => {
  const [lookupFn, ...cases] = args;
  const lookup = lookupFn();
  // remove last odd item from cases array
  const defValue = cases.splice(-1, cases.length % 2)[0];
  for (let fry = 0; fry < cases.length - 1; fry += 2) {
    const key = cases[fry]();
    if (key === lookup) {
      return cases[fry + 1]();
    }
  }
  return defValue();
};

type OutputType = any;
const caseFunc: ExpressionCbFunc<
  [boolean, OutputType, ...Array<boolean | OutputType>],
  OutputType
> = (args) => {
  if (args.length < 2) {
    throw new Error(
      'The "case" function requires at least a condition and a corresponding output.',
    );
  }

  if (args.length % 2 === 0) {
    throw new Error(
      'Missing a fallback value or unmatched condition-output pair.',
    );
  }
  for (let i = 0; i < args.length - 1; i += 2) {
    const condition = args[i]() as boolean;
    const value = args[i + 1]() as OutputType;
    if (condition) {
      return value;
    }
  }
  const fallback = args[args.length - 1];
  return fallback();
};

export const decisionExpressions: Record<
  DecisionExpressionName,
  ExpressionCbFunc
> = {
  '!': e(not),
  '!=': e(notEqual),
  '<': e(lessThan),
  '<=': e(lessThanOrEqual),
  '==': e(equal),
  '>': e(greaterThan),
  '>=': e(greaterThanOrEqual),
  coalesce,
  all,
  any,
  case: caseFunc,
  match,
};
