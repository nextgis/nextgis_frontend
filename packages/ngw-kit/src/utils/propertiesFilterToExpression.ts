import type {
  Properties,
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';

type FilterExpressionString = string & {
  readonly __brand: 'FilterExpressionString';
};

type GetExpr = ['get', string];
type FidExpr = ['fid'];
type FieldExpr = GetExpr | FidExpr;

type EqNeOp = '==' | '!=';
type CmpOp = '>' | '<' | '>=' | '<=';
type InOp = 'in' | '!in';
type IsNullOp = 'is_null' | '!is_null';
type IlikeOp = 'ilike';

type ConditionValue = string | number | boolean | null;

type EqNeExpr = [EqNeOp, FieldExpr, ConditionValue];
type CmpExpr = [CmpOp, FieldExpr, number | string];
type InExpr = [InOp, FieldExpr, ...(string | number)[]];
type IsNullExpr = [IsNullOp, FieldExpr];
type IlikeExpr = [IlikeOp, FieldExpr, string];

type ConditionExpr = EqNeExpr | CmpExpr | InExpr | IsNullExpr | IlikeExpr;

type LogicalOp = 'all' | 'any';
type GroupExpr = [LogicalOp, ...(ConditionExpr | GroupExpr)[]];
type FilterExpression = [] | GroupExpr;

function isPropertyFilter<T extends Properties = Properties>(
  value: unknown,
): value is PropertyFilter<T> {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string'
  );
}

function isPropertiesFilterGroup<T extends Properties = Properties>(
  value: unknown,
): value is PropertiesFilter<T> {
  return Array.isArray(value) && !isPropertyFilter(value);
}

function toGetExpr(field: string): FieldExpr {
  return field === 'id' ? ['fid'] : ['get', field];
}

function parseWildcardField(field: string): {
  field: string;
  leadingWildcard: boolean;
  trailingWildcard: boolean;
} {
  const leadingWildcard = field.startsWith('%');
  const trailingWildcard = field.endsWith('%');
  return {
    field: field.slice(
      leadingWildcard ? 1 : 0,
      trailingWildcard ? -1 : undefined,
    ),
    leadingWildcard,
    trailingWildcard,
  };
}

function toConditionExpr<T extends Properties = Properties>(
  filter: PropertyFilter<T>,
): ConditionExpr {
  const [fieldRaw, op, value] = filter;
  const field = String(fieldRaw);
  const getExpr = toGetExpr(field);

  switch (op) {
    case 'eq':
      if (value === null) {
        return ['is_null', getExpr];
      }
      return ['==', getExpr, value as ConditionValue];

    case 'ne':
      if (value === null) {
        return ['!is_null', getExpr];
      }
      return ['!=', getExpr, value as ConditionValue];

    case 'gt':
      if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(
          `Operator "gt" requires number or string for "${field}"`,
        );
      }
      return ['>', getExpr, value];

    case 'lt':
      if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(
          `Operator "lt" requires number or string for "${field}"`,
        );
      }
      return ['<', getExpr, value];

    case 'ge':
      if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(
          `Operator "ge" requires number or string for "${field}"`,
        );
      }
      return ['>=', getExpr, value];

    case 'le':
      if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(
          `Operator "le" requires number or string for "${field}"`,
        );
      }
      return ['<=', getExpr, value];

    case 'in':
      if (
        !Array.isArray(value) ||
        !value.every((x) => typeof x === 'string' || typeof x === 'number')
      ) {
        throw new Error(
          `Operator "in" requires (string | number)[] for "${field}"`,
        );
      }
      if (!value.length) {
        throw new Error(
          `Operator "in" requires non-empty array for "${field}"`,
        );
      }
      return ['in', getExpr, ...value];

    case 'notin':
      if (
        !Array.isArray(value) ||
        !value.every((x) => typeof x === 'string' || typeof x === 'number')
      ) {
        throw new Error(
          `Operator "notin" requires (string | number)[] for "${field}"`,
        );
      }
      if (!value.length) {
        throw new Error(
          `Operator "notin" requires non-empty array for "${field}"`,
        );
      }
      return ['!in', getExpr, ...value];

    case 'ilike': {
      if (typeof value !== 'string') {
        throw new Error(`Operator "ilike" requires string for "${field}"`);
      }
      const parsed = parseWildcardField(field);
      const pattern = `${parsed.leadingWildcard ? '%' : ''}${value}${parsed.trailingWildcard ? '%' : ''}`;
      return ['ilike', toGetExpr(parsed.field), pattern];
    }

    case 'like':
      throw new Error(
        `Operator "${op}" is not supported by server FilterExpression`,
      );

    default: {
      const exhaustive: never = op;
      throw new Error(`Unsupported operator: ${exhaustive}`);
    }
  }
}

function toGroupExpr<T extends Properties = Properties>(
  filters: PropertiesFilter<T>,
): GroupExpr {
  let logicalOp: LogicalOp = 'all';
  const children: Array<ConditionExpr | GroupExpr> = [];

  for (const item of filters) {
    if (item === 'all' || item === 'any') {
      logicalOp = item;
      continue;
    }

    if (isPropertyFilter(item)) {
      children.push(toConditionExpr(item));
      continue;
    }

    if (isPropertiesFilterGroup(item)) {
      children.push(toGroupExpr(item));
      continue;
    }

    throw new Error('Invalid PropertiesFilter node');
  }

  return [logicalOp, ...children];
}

export function propertiesFilterToExpression<T extends Properties = Properties>(
  filters?: PropertiesFilter<T>,
): FilterExpression {
  if (!filters?.length) {
    return [];
  }

  return toGroupExpr(filters);
}

export function propertiesFilterToExpressionString<
  T extends Properties = Properties,
>(filters?: PropertiesFilter<T>): FilterExpressionString | undefined {
  if (!filters?.length) {
    return undefined;
  }

  return JSON.stringify(
    propertiesFilterToExpression(filters),
  ) as FilterExpressionString;
}

export function createLayerFilterParam<T extends Properties = Properties>(
  resourceId: number,
  filters?: PropertiesFilter<T>,
): Record<string, string | undefined> {
  return {
    [`filter[${resourceId}]`]: propertiesFilterToExpressionString(filters),
  };
}
