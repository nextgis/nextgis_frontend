import { evaluateArg } from '../expression';
import { tryConvert } from '../utils/tryConvert';

import type { Data, TypeExpressionName } from '../interfaces';

type TypeExpressionFunc = (data: Data, args: any[]) => any;

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
export const typeExpressions = {} as Record<
  TypeExpressionName,
  TypeExpressionFunc
>;
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
