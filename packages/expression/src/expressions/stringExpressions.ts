import type { ExpressionFunc, StringExpressionName } from '../interfaces';

export const stringExpressions: Record<
  StringExpressionName,
  ExpressionFunc<string[], string>
> = {
  concat: (args) => args.reduce((a, b) => String(a) + String(b), ''),
  downcase: (args) => String(args[0]).toLowerCase(),
  upcase: (args) => String(args[0]).toUpperCase(),
};
