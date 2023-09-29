import { evaluateArg } from '../expression';

import type {
  Data,
  ExpressionArg,
  ExpressionFunc,
  ExpressionArgsFunc,
} from '../interfaces';

export default function evaluateAndApply<
  T extends ExpressionArg = ExpressionArg,
  R extends T = T,
>(cb: ExpressionArgsFunc<T, R>): ExpressionFunc {
  return (data: Data, args: any[]) =>
    cb(args.map((arg) => evaluateArg(data, arg)));
}
