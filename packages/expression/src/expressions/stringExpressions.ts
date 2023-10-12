import e from '../utils/evaluateArgs';
import type { ExpressionCbFunc, StringExpressionName } from '../interfaces';

export const stringExpressions: Record<
  StringExpressionName,
  ExpressionCbFunc<string[], string>
> = {
  concat: e((args) => args.reduce((a, b) => String(a) + String(b), '')),
  downcase: e((args) => String(args[0]).toLowerCase()),
  upcase: e((args) => String(args[0]).toUpperCase()),
};
