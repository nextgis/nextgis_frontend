import { tryConvert } from './tryConvert';

import type { ExpressionArg, ExpressionArgsFunc } from '../interfaces';

export default function fallback<T extends ExpressionArg = ExpressionArg>(
  cb: ExpressionArgsFunc<T>,
) {
  return (args: ExpressionArg[]) => {
    for (const arg of args) {
      const result = tryConvert(cb, arg);
      if (result !== undefined) {
        return result;
      }
    }
  };
}
