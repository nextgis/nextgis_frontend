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
  | 'match';

export type InterpolationExpressionName = 'step';

export type ExpressionName =
  | MathExpressionName
  | TypeExpressionName
  | LookupExpressionName
  | DecisionExpressionName
  | InterpolationExpressionName;

export type SimpleType = string | number | boolean | null | Record<string, any>;
type ExpressionArg = SimpleType | Expression;
export type Expression = [ExpressionName, ...ExpressionArg[]];

export type ExpressionFunc<T = any, R = T> = (args: T, data: Data) => R;