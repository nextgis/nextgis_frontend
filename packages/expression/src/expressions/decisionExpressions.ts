import type { ExpressionFunc, DecisionExpressionName } from '../interfaces';

function not([expr]: [boolean]): boolean {
  return !expr;
}

const checkCompareValues = ([a, b]: [value1: any, value2: any]) => {
  if (typeof a !== typeof b) {
    throw new Error('Values have different types.');
  }
};

function notEqual([a, b]: [value1: any, value2: any]): boolean {
  checkCompareValues([a, b]);
  return a !== b;
}

function lessThan([left, right]: [value1: any, value2: any]): boolean {
  checkCompareValues([left, right]);
  return left < right;
}

function lessThanOrEqual([left, right]: [value1: any, value2: any]): boolean {
  checkCompareValues([left, right]);
  return left <= right;
}

function equal([left, right]: [value1: any, value2: any]): boolean {
  checkCompareValues([left, right]);
  return left === right;
}

function greaterThan([left, right]: [value1: any, value2: any]): boolean {
  checkCompareValues([left, right]);
  return left > right;
}

function greaterThanOrEqual([left, right]: [
  value1: any,
  value2: any,
]): boolean {
  checkCompareValues([left, right]);
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

type OutputType = any;
function caseFunc(
  args: [boolean, OutputType, ...Array<boolean | OutputType>],
): OutputType {
  if (args.length < 2) {
    throw new Error(
      'The "case" function requires at least a condition and a corresponding output.',
    );
  }
  const fallback = args[args.length - 1];
  if (args.length % 2 === 0) {
    throw new Error(
      'Missing a fallback value or unmatched condition-output pair.',
    );
  }
  for (let i = 0; i < args.length - 1; i += 2) {
    const condition = args[i] as boolean;
    const value = args[i + 1] as OutputType;
    if (condition) {
      return value;
    }
  }
  return fallback;
}

export const decisionExpressions: Record<
  DecisionExpressionName,
  ExpressionFunc
> = {
  '!': not,
  '!=': notEqual,
  '<': lessThan,
  '<=': lessThanOrEqual,
  '==': equal,
  '>': greaterThan,
  '>=': greaterThanOrEqual,
  all: all,
  any: any,
  case: caseFunc,
  match,
};
