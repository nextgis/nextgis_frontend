import e from '../utils/evaluateArgs';
import f from '../utils/fallback';

import type { ExpressionCbFunc, TypeExpressionName } from '../interfaces';

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

function typeOfValue(value: any): string {
  if (value === null) return 'null';
  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      if (Array.isArray(value)) {
        let arrayType = 'value';
        if (value.every((item) => typeof item === 'number')) {
          arrayType = 'number';
        } else if (value.every((item) => typeof item === 'string')) {
          arrayType = 'string';
        } else if (value.every((item) => typeof item === 'boolean')) {
          arrayType = 'boolean';
        }
        return `array<${arrayType}, ${value.length}>`;
      } else {
        return 'object';
      }
    default:
      return 'undefined';
  }
}

export const typeExpressions: Record<TypeExpressionName, ExpressionCbFunc> = {
  array: e(array),
  boolean: e(
    f<boolean[]>((arg) => (typeof arg === 'boolean' ? arg : undefined)),
  ),
  literal: e(([arg]) => arg),
  number: e(f<number[]>((arg) => (typeof arg === 'number' ? arg : undefined))),
  object: e(
    f<Record<string, any>[]>((arg) =>
      arg !== null && typeof arg === 'object' && !Array.isArray(arg)
        ? arg
        : undefined,
    ),
  ),

  string: e(f((arg) => (typeof arg === 'string' ? arg : undefined))),
  'to-boolean': e(f(Boolean)),
  'to-number': e(f(Number)),
  'to-string': e(f(String)),
  typeof: e(([arg]) => typeOfValue(arg)),
};
