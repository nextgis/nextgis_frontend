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
  | 'literal'
  | 'number'
  | 'object'
  | 'string'
  | 'to-boolean'
  | 'to-number'
  | 'to-string'
  | 'typeof';
// | 'collator'
// | 'format'
// | 'number-format'
// | 'to-color'

export type StringExpressionName = 'concat' | 'downcase' | 'upcase';

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
  | 'tan';
// | 'distance'

export type DecisionExpressionName =
  | '!'
  | '!='
  | '<'
  | '<='
  | '=='
  | '>='
  | '>'
  | 'all'
  | 'any'
  | 'case'
  | 'match'
  | 'coalesce';

export type InterpolationExpressionName = 'step' | 'interpolate';

export type ExpressionName =
  | MathExpressionName
  | TypeExpressionName
  | StringExpressionName
  | LookupExpressionName
  | DecisionExpressionName
  | InterpolationExpressionName;

export type SimpleType = string | number | boolean | null | Record<string, any>;
type ExpressionArg = SimpleType | Expression;
export type Expression = [ExpressionName, ...ExpressionArg[]];

type Callback<T> = () => T;
export type MapToCallback<T = any> = { [K in keyof T]: Callback<T[K]> };

export type ExpressionCbFunc<T = any, R = T extends Array<any> ? T[0] : any> = (
  args: MapToCallback<T>,
  data: Data,
) => R;
export type ExpressionFunc<T = any, R = T extends Array<any> ? T[0] : any> = (
  args: T,
  data: Data,
) => R;
