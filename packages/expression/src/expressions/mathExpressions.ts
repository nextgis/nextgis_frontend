import evaluateAndApply from '../utils/evaluateAndApply';

import type { MathExpressionFunc, MathExpressionName } from '../interfaces';

const m = evaluateAndApply<number>;

export const mathExpressions: Record<MathExpressionName, MathExpressionFunc> = {
  '+': m((args) => args.reduce((a, b) => a + b, 0)),
  '-': m((args) => args.reduce((a, b) => a - b)),
  '*': m((args) => args.reduce((a, b) => a * b, 1)),
  '/': m((args) => args.reduce((a, b) => a / b)),
  '%': m((args) => args[0] % args[1]),
  '^': m((args) => Math.pow(args[0], args[1])),
  abs: m((args) => Math.abs(args[0])),
  acos: m((args) => Math.acos(args[0])),
  asin: m((args) => Math.asin(args[0])),
  atan: m((args) => Math.atan(args[0])),
  ceil: m((args) => Math.ceil(args[0])),
  cos: m((args) => Math.cos(args[0])),
  e: () => Math.E,
  floor: m((args) => Math.floor(args[0])),
  ln: m((args) => Math.log(args[0])),
  ln2: () => Math.LN2,
  log10: m((args) => Math.log10(args[0])),
  log2: m((args) => Math.log2(args[0])),
  max: m((args) => Math.max(...args)),
  min: m((args) => Math.min(...args)),
  pi: () => Math.PI,
  round: m((args) => Math.round(args[0])),
  sin: m((args) => Math.sin(args[0])),
  sqrt: m((args) => Math.sqrt(args[0])),
  tan: m((args) => Math.tan(args[0])),
};
