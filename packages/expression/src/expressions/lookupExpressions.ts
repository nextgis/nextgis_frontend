import { evaluateArg } from '../expression';

import type { Data, LookupExpressionName } from '../interfaces';

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

export const lookupExpressions = {
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
