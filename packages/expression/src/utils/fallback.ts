import { tryConvert } from './tryConvert';

import type { ExpressionFunc, SimpleType } from '../interfaces';

export default function fallback<T extends SimpleType = SimpleType, R = T>(
  cb: ExpressionFunc<T, R | undefined>,
): ExpressionFunc<T[], R> {
  return (args: T[], data) => {
    for (const arg of args) {
      const result = tryConvert(cb, arg, data);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(`Parameters not corrected`);
  };
}
