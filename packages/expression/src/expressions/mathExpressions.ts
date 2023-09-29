import type { ExpressionFunc, MathExpressionName } from '../interfaces';

export const mathExpressions: Record<
  MathExpressionName,
  ExpressionFunc<number[], number>
> = {
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
