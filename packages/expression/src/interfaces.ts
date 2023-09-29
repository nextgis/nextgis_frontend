export type Data = Record<string, any>;

export type LookupExpressionName =
  | 'at'
  | 'get'
  | 'has'
  | 'length'
  | 'in'
  | 'index-of'
  | 'slice';

export type TypeExpressionName =
  | 'array'
  | 'boolean'
  // | 'collator'
  // | 'format'
  | 'literal'
  | 'number'
  // | 'number-format'
  | 'object'
  | 'string'
  | 'to-boolean'
  // | 'to-color'
  | 'to-number'
  | 'to-string'
  | 'typeof';

export type MathExpressionName =
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '^'
  | 'abs'
  | 'acos'
  | 'asin'
  | 'atan'
  | 'ceil'
  | 'cos'
  | 'e'
  | 'floor'
  | 'ln'
  | 'ln2'
  | 'log10'
  | 'log2'
  | 'max'
  | 'min'
  | 'pi'
  | 'round'
  | 'sin'
  | 'sqrt'
  // | 'distance'
  | 'tan';

export type ExpressionName =
  | MathExpressionName
  | TypeExpressionName
  | LookupExpressionName
  | '!'
  | '!='
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | 'all'
  | 'any'
  | 'case'
  | 'step'
  | 'coalesce'
  | 'match';

export type Expression = [ExpressionName, ...ExpressionArg[]];

export type SimpleType = string | number | boolean | undefined;

export type ExpressionArg = SimpleType | Expression;

export type ExpressionFunc<T = any, R extends T = T> = (
  data: Data,
  args: T[],
) => R;
export type ExpressionArgsFunc<
  T extends ExpressionArg = ExpressionArg,
  R extends T = T,
> = (args: T[]) => R;

export type MathExpressionFunc = ExpressionFunc<number>;
export type TypeExpressionFunc = ExpressionFunc<any[], any>;
