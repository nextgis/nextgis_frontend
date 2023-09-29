import { evaluateArg } from '../expression';

import type {
  Data,
  SimpleType,
  ExpressionFunc,
  ExpressionArgsFunc,
} from '../interfaces';

export default function evaluateAndApply<T extends SimpleType = SimpleType>(
  cb: ExpressionArgsFunc<T>,
): ExpressionFunc {
  return (data: Data, args: any[]) =>
    cb(args.map((arg) => evaluateArg(data, arg)));
}
