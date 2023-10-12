import type {
  ExpressionCbFunc,
  ExpressionFunc,
  MapToCallback,
  SimpleType,
} from '../interfaces';

export default function evaluateArgs<
  T extends SimpleType[] = SimpleType[],
  R = T[0],
>(cb: ExpressionFunc<T, R>): ExpressionCbFunc<T, R> {
  return (args: MapToCallback<T>, data) => {
    const unwrap = args.map((a) => a()) as T;
    return cb(unwrap, data);
  };
}
