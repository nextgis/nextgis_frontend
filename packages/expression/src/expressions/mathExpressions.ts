import e from '../utils/evaluateArgs';

import type { ExpressionCbFunc, MathExpressionName } from '../interfaces';

export const mathExpressions: Record<
  MathExpressionName,
  ExpressionCbFunc<number[], number>
> = {
  '+': e((args) => args.reduce((a, b) => a + b, 0)),
  '-': e((args) => args.reduce((a, b) => a - b)),
  '*': e((args) => args.reduce((a, b) => a * b, 1)),
  '/': e((args) => args.reduce((a, b) => a / b)),
  '%': e((args) => args[0] % args[1]),
  '^': e((args) => Math.pow(args[0], args[1])),
  abs: e((args) => Math.abs(args[0])),
  acos: e((args) => Math.acos(args[0])),
  asin: e((args) => Math.asin(args[0])),
  atan: e((args) => Math.atan(args[0])),
  ceil: e((args) => Math.ceil(args[0])),
  cos: e((args) => Math.cos(args[0])),
  e: () => Math.E,
  floor: e((args) => Math.floor(args[0])),
  ln: e((args) => Math.log(args[0])),
  ln2: () => Math.LN2,
  log10: e((args) => Math.log10(args[0])),
  log2: e((args) => Math.log2(args[0])),
  max: e((args) => Math.max(...args)),
  min: e((args) => Math.min(...args)),
  pi: () => Math.PI,
  round: e((args) => Math.round(args[0])),
  sin: e((args) => Math.sin(args[0])),
  sqrt: e((args) => Math.sqrt(args[0])),
  tan: e((args) => Math.tan(args[0])),
};
