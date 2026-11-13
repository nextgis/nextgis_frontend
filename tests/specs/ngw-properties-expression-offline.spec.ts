import { describe, expect, it } from 'vitest';

import {
  propertiesFilterToExpression,
  propertiesFilterToExpressionString,
} from '../../packages/ngw-kit/src/utils/propertiesFilterToExpression';

import type { PropertiesFilter } from '../../packages/properties-filter/src/interfaces';

describe('NGW server-side properties filter expression compatibility', () => {
  it('omits the server filter when no conditions are supplied', () => {
    expect(propertiesFilterToExpression()).toEqual([]);
    expect(propertiesFilterToExpression([])).toEqual([]);
    expect(propertiesFilterToExpressionString()).toBeUndefined();
    expect(propertiesFilterToExpressionString([])).toBeUndefined();
  });

  it('uses the fid operator for the resource ID and get for ordinary fields', () => {
    expect(propertiesFilterToExpression([
      ['id', 'eq', 13], ['name', 'ne', 'Other'],
    ])).toEqual(['all',
      ['==', ['fid'], 13],
      ['!=', ['get', 'name'], 'Other'],
    ]);
  });

  it('turns null equality comparisons into null predicates', () => {
    expect(propertiesFilterToExpression([
      ['name', 'eq', null], ['description', 'ne', null],
    ])).toEqual(['all',
      ['is_null', ['get', 'name']],
      ['!is_null', ['get', 'description']],
    ]);
  });

  it('preserves greater/lesser comparisons and boundary operators', () => {
    expect(propertiesFilterToExpression([
      ['rank', 'gt', 10], ['rank', 'lt', 50],
      ['score', 'ge', 3], ['score', 'le', 4],
    ])).toEqual(['all',
      ['>', ['get', 'rank'], 10],
      ['<', ['get', 'rank'], 50],
      ['>=', ['get', 'score'], 3],
      ['<=', ['get', 'score'], 4],
    ]);
  });

  it('preserves the server argument order for in and notin', () => {
    expect(propertiesFilterToExpression([
      ['category', 'in', ['road', 'river']],
      ['rank', 'notin', [0, 99]],
    ])).toEqual(['all',
      ['in', ['get', 'category'], 'road', 'river'],
      ['!in', ['get', 'rank'], 0, 99],
    ]);
  });

  it('keeps nested any/all groups rather than flattening away their semantics', () => {
    const filters: PropertiesFilter = [
      'any',
      ['status', 'eq', 'active'],
      ['all', ['rank', 'ge', 2], ['rank', 'le', 5]],
    ];
    expect(propertiesFilterToExpression(filters)).toEqual([
      'any',
      ['==', ['get', 'status'], 'active'],
      ['all', ['>=', ['get', 'rank'], 2], ['<=', ['get', 'rank'], 5]],
    ]);
  });

  it('translates field-name wildcard notation into a server ilike expression', () => {
    expect(propertiesFilterToExpression([
      ['%name%', 'ilike', 'River'],
      ['title%', 'ilike', 'Road'],
      ['%code', 'ilike', 'B'],
    ])).toEqual(['all',
      ['ilike', ['get', 'name'], '%River%'],
      ['ilike', ['get', 'title'], 'Road%'],
      ['ilike', ['get', 'code'], '%B'],
    ]);
  });

  it('serializes exactly the same nested filter sent to the NGW API', () => {
    const filters: PropertiesFilter = [
      'any', ['id', 'eq', 4], ['name', 'ilike', 'Main'],
    ];
    expect(propertiesFilterToExpressionString(filters)).toBe(
      JSON.stringify(propertiesFilterToExpression(filters)),
    );
  });

  it.each(['gt', 'lt', 'ge', 'le'] as const)(
    'rejects non-comparable values for %s', (operation) => {
      expect(() => propertiesFilterToExpression([['rank', operation, false]]))
        .toThrow(`Operator "${operation}" requires number or string`);
    },
  );

  it.each(['in', 'notin'] as const)(
    'rejects empty membership lists for %s', (operation) => {
      expect(() => propertiesFilterToExpression([['category', operation, []]]))
        .toThrow('requires non-empty array');
    },
  );

  it('rejects membership lists containing unsupported values', () => {
    expect(() => propertiesFilterToExpression([
      ['category', 'in', ['road', null]],
    ])).toThrow('requires (string | number)[]');
  });

  it('rejects ilike values that are not strings', () => {
    expect(() => propertiesFilterToExpression([['name', 'ilike', 10]]))
      .toThrow('requires string');
  });

  it('fails explicitly for the SQL like operator unsupported by server filters', () => {
    expect(() => propertiesFilterToExpression([['name', 'like', 'road%']]))
      .toThrow('is not supported by server FilterExpression');
  });
});
