import e from '../utils/evaluateArgs';

import type {
  Data,
  SimpleType,
  LookupExpressionName,
  ExpressionCbFunc,
} from '../interfaces';

type GetArg = [key: string] | [key: string, obj: Record<string, any>];

function get([key, objExp]: GetArg, data: Data): SimpleType | null {
  const target = objExp || data;
  if (target && typeof target === 'object' && key in target) {
    return target[key];
  }
  return null;
}

function has([key, objExp]: GetArg, data: Data): boolean {
  const target = objExp || data;
  return !!(target && typeof target === 'object' && key in target);
}

function at([index, array]: [index: number, array: any[]]): SimpleType {
  return array[index];
}

type InArgs = [keyword: string | boolean | number, input: string | any[]];
function inFunc([keyword, input]: InArgs): boolean {
  if (typeof input === 'string') {
    return input.includes(String(keyword));
  } else if (Array.isArray(input)) {
    return input.includes(keyword);
  }
  throw new Error(
    `Invalid input type for 'in'. Expected string or array, got ${typeof input}.`,
  );
}

const length = ([item]: [string | any[]]) => {
  if (typeof item === 'string' || Array.isArray(item)) {
    return item.length;
  }
  return undefined;
};

type IndexOfArgs =
  | [keyword: string | boolean | number, input: string | any[]]
  | [keyword: string | boolean | number, input: string | any[], index: number];
function indexOf([keyword, input, startIndex]: IndexOfArgs): number {
  if (typeof input === 'string') {
    return input.indexOf(String(keyword), startIndex);
  } else if (Array.isArray(input)) {
    return input.indexOf(keyword, startIndex);
  }

  throw new Error(
    `Invalid input type for 'index-of'. Expected string or array, got ${typeof input}.`,
  );
}

type SliceArgs =
  | [input: string | any[], startIndex: number]
  | [input: string | any[], startIndex: number, endIndex: number];

function slice(args: SliceArgs): string | any[] {
  const [input, startIndex, endIndex] = args;

  if (typeof input === 'string') {
    return input.slice(startIndex, endIndex);
  } else if (Array.isArray(input)) {
    return input.slice(startIndex, endIndex);
  }

  throw new Error(
    `Invalid input type for 'slice'. Expected string or array, got ${typeof input}.`,
  );
}

export const lookupExpressions: Record<LookupExpressionName, ExpressionCbFunc> =
  {
    get: e(get),
    length: e(length),
    at: e(at),
    has: e(has),
    in: e(inFunc),
    'index-of': e(indexOf),
    slice: e(slice),
  };
