import f from '../utils/fallback';

import type { ExpressionFunc, TypeExpressionName } from '../interfaces';

type ArrayType = 'string' | 'number' | 'boolean';

type ArrayArgs =
  | [value: any[]]
  | [type: ArrayType, value: any[]]
  | [type: ArrayType, n: number, value: any[]];

const array = (args: ArrayArgs): any[] => {
  const [firstArg, secondArg, thirdArg] = args;
  let requiredType: ArrayType | undefined = undefined;
  let requiredLength: number | undefined = undefined;
  let value: any[] | undefined;

  if (
    typeof firstArg === 'string' &&
    ['string', 'number', 'boolean'].includes(firstArg)
  ) {
    requiredType = firstArg;

    if (typeof secondArg === 'number') {
      requiredLength = secondArg;
      value = thirdArg;
    } else {
      value = secondArg;
    }
  } else if (Array.isArray(firstArg)) {
    value = firstArg;
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

export const typeExpressions: Record<TypeExpressionName, ExpressionFunc> = {
  array,
  boolean: f<boolean>((arg) => (typeof arg === 'boolean' ? arg : undefined)),
  literal: ([arg]) => arg,
  number: f<number>((arg) => (typeof arg === 'number' ? arg : undefined)),
  object: f<Record<string, any>>((arg) =>
    arg !== null && typeof arg === 'object' && !Array.isArray(arg)
      ? arg
      : undefined,
  ),

  string: f((arg) => (typeof arg === 'string' ? arg : undefined)),
  'to-boolean': f(Boolean),
  'to-number': f(Number),
  'to-string': f(String),
  typeof: ([arg]) => typeof arg,
};
