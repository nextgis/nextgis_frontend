type Data = Record<string, any>;

export type LookupExpressionName =
  | 'at'
  | 'get'
  | 'has'
  | 'length'
  | 'in'
  | 'index-of'
  | 'slice';

export type TypeExpressionName =
  | 'array'
  | 'boolean'
  // | 'collator'
  // | 'format'
  | 'literal'
  | 'number'
  // | 'number-format'
  | 'object'
  | 'string'
  | 'to-boolean'
  // | 'to-color'
  | 'to-number'
  | 'to-string'
  | 'typeof';

export type MathExpressionName =
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '^'
  | 'abs'
  | 'acos'
  | 'asin'
  | 'atan'
  | 'ceil'
  | 'cos'
  | 'e'
  | 'floor'
  | 'ln'
  | 'ln2'
  | 'log10'
  | 'log2'
  | 'max'
  | 'min'
  | 'pi'
  | 'round'
  | 'sin'
  | 'sqrt'
  // | 'distance'
  | 'tan';

export type ExpressionName =
  | MathExpressionName
  | TypeExpressionName
  | LookupExpressionName
  | '!'
  | '!='
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | 'all'
  | 'any'
  | 'case'
  | 'step'
  | 'coalesce'
  | 'match';

export type Expression = [ExpressionName, ...ExpressionArg[]];

export type SimpleType = string | number | boolean | undefined;

export type ExpressionArg = SimpleType | Expression;

export type ExpressionFun = (data: Data, args: ExpressionArg[]) => SimpleType;

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

function evaluateArg(data: Data, arg: any): any {
  if (isExpression(arg)) {
    return evaluate(data, arg);
  }
  return arg;
}

type MathExpressionFunc = (data: Data, args: any[]) => number;
const mathExpressionsRaw: Record<MathExpressionName, (args: any[]) => number> =
  {
    '+': (args) => args.reduce((a, b) => a + b, 0),
    '-': (args) => args.reduce((a, b) => a - b),
    '*': (args) => args.reduce((a, b) => a * b, 1),
    '/': (args) => args.reduce((a, b) => a / b),
    '%': (args) => args[0] % args[1],
    '^': (args) => Math.pow(args[0], args[1]),
    abs: (args) => Math.abs(args[0]),
    acos: (args) => Math.acos(args[0]),
    asin: (args) => Math.asin(args[0]),
    atan: (args) => Math.atan(args[0]),
    ceil: (args) => Math.ceil(args[0]),
    cos: (args) => Math.cos(args[0]),
    e: () => Math.E,
    floor: (args) => Math.floor(args[0]),
    ln: (args) => Math.log(args[0]),
    ln2: () => Math.LN2,
    log10: (args) => Math.log10(args[0]),
    log2: (args) => Math.log2(args[0]),
    max: (args) => Math.max(...args),
    min: (args) => Math.min(...args),
    pi: () => Math.PI,
    round: (args) => Math.round(args[0]),
    sin: (args) => Math.sin(args[0]),
    sqrt: (args) => Math.sqrt(args[0]),
    tan: (args) => Math.tan(args[0]),
  };

const mathExpressions = {} as Record<MathExpressionName, MathExpressionFunc>;
for (const key in mathExpressionsRaw) {
  const m = key as MathExpressionName;
  const mathExpression: MathExpressionFunc = (data, args) =>
    mathExpressionsRaw[m](args.map((arg) => evaluateArg(data, arg)));

  mathExpressions[m] = mathExpression;
}

type TypeExpressionFunc = (data: Data, args: any[]) => any;

const tryConvert = (converter: (arg: any) => any, arg: any): any => {
  try {
    const result = converter(arg);
    if (result !== undefined) {
      return result;
    }
  } catch {
    // ignore errors
  }
  return undefined;
};

const typeExpressionsRaw: Record<TypeExpressionName, (arg: any) => any> = {
  array: (arg) => (Array.isArray(arg) ? arg : undefined),
  boolean: (arg) => (typeof arg === 'boolean' ? arg : undefined),
  literal: (arg) => arg,
  number: (arg) => (typeof arg === 'number' ? arg : undefined),
  object: (arg) =>
    arg !== null && typeof arg === 'object' && !Array.isArray(arg)
      ? arg
      : undefined,
  string: (arg) => (typeof arg === 'string' ? arg : undefined),
  'to-boolean': Boolean,
  'to-number': Number,
  'to-string': String,
  typeof: (arg) => typeof arg,
};
const typeExpressions = {} as Record<TypeExpressionName, TypeExpressionFunc>;
for (const key in typeExpressionsRaw) {
  const t = key as TypeExpressionName;
  const typeExpression: TypeExpressionFunc = (data, args) => {
    const evaluatedArgs = args.map((arg) => evaluateArg(data, arg));
    for (const arg of evaluatedArgs) {
      const result = tryConvert(typeExpressionsRaw[t], arg);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(`Parameters for '${t}' not corrected`);
  };

  typeExpressions[t] = typeExpression;
}

type LookupExpressionFunc = (data: Data, args: any[]) => any;

type LookupExpressionNameRaw = Exclude<LookupExpressionName, 'get' | 'length'>;
const lookupExpressionsRaw: Record<
  LookupExpressionNameRaw,
  (args: any[]) => any
> = {
  at: ([arrayOrString, index]) => arrayOrString[index],
  has: ([arrayOrString, item]) => arrayOrString.includes(item),
  in: ([item, arr]) => arr.includes(item),
  'index-of': (args) => {
    const [arrayOrString, target] = args;
    if (typeof arrayOrString === 'string') {
      return arrayOrString.indexOf(target);
    } else if (Array.isArray(arrayOrString)) {
      return arrayOrString.indexOf(target);
    }
    throw new Error(`Parameters for 'index-of' not corrected`);
  },
  slice: (args) => {
    const [arrayOrString, start, end] = args;
    if (typeof arrayOrString === 'string' || Array.isArray(arrayOrString)) {
      return arrayOrString.slice(start, end);
    }
    throw new Error(`Parameters for 'slice' not corrected`);
  },
};

const get: LookupExpressionFunc = (data, args) => {
  const [key, objExp] = args;

  const target = objExp ? evaluateArg(data, objExp) : data;

  return target[key];
};

function length(data: Data, args: any[]): number | undefined {
  const [item] = args;
  const evaluatedItem = evaluateArg(data, item);
  if (typeof evaluatedItem === 'string' || Array.isArray(evaluatedItem)) {
    return evaluatedItem.length;
  }
  return undefined;
}

const lookupExpressions = {
  get,
  length,
} as Record<LookupExpressionName, LookupExpressionFunc>;
for (const key in lookupExpressionsRaw) {
  const t = key as LookupExpressionNameRaw;
  const lookupExpression: LookupExpressionFunc = (data, args) => {
    const evaluatedArgs = args.map((arg) => evaluateArg(data, arg));
    return lookupExpressionsRaw[t](evaluatedArgs);
  };

  lookupExpressions[t] = lookupExpression;
}

const expressions: { [key in ExpressionName]: ExpressionFun } = {
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
