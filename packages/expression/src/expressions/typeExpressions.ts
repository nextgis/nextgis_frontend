import evaluateAndApply from '../utils/evaluateAndApply';
import { evaluateArg } from '../expression';

import type { TypeExpressionFunc, TypeExpressionName } from '../interfaces';
import fallback from '../utils/fallback';

const m = evaluateAndApply<any>;
const f = fallback<any>;

type ArrayType = 'string' | 'number' | 'boolean';

const array: TypeExpressionFunc = (data, args) => {
  const [firstArg, secondArg, thirdArg, fourthArg] = args;

  let requiredType: ArrayType | undefined = undefined;
  let requiredLength: number | undefined = undefined;
  let value: any;

  if (
    typeof firstArg === 'string' &&
    ['string', 'number', 'boolean'].includes(firstArg)
  ) {
    requiredType = firstArg;

    if (typeof secondArg === 'number') {
      requiredLength = secondArg;
      value = evaluateArg(data, fourthArg);
    } else {
      value = evaluateArg(data, thirdArg);
    }
  } else {
    value = evaluateArg(data, firstArg);
  }

  if (!Array.isArray(value)) {
    throw new Error('Expected an array');
  }

  if (requiredType && !value.every((item) => typeof item === requiredType)) {
    throw new Error(
      `Expected all items in array to be of type ${requiredType}`,
    );
  }

  if (requiredLength && value.length !== requiredLength) {
    throw new Error(`Expected array of length ${requiredLength}`);
  }

  return value;
};

export const typeExpressions: Record<TypeExpressionName, TypeExpressionFunc> = {
  array,
  boolean: m(f((arg) => (typeof arg === 'boolean' ? arg : undefined))),
  literal: m((arg) => arg),
  number: m(f((arg) => (typeof arg === 'number' ? arg : undefined))),
  object: m(
    f((arg) =>
      arg !== null && typeof arg === 'object' && !Array.isArray(arg)
        ? arg
        : undefined,
    ),
  ),
  string: m(f((arg) => (typeof arg === 'string' ? arg : undefined))),
  'to-boolean': m(Boolean),
  'to-number': m(Number),
  'to-string': m(String),
  typeof: m((arg) => typeof arg),
};
