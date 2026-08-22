import { expect } from 'chai';

import { fetchNgwLayerItems } from '../../packages/ngw-kit/src/utils/fetchNgwLayerItems';
import { propertiesFilterToExpression } from '../../packages/ngw-kit/src/utils/propertiesFilterToExpression';

import type { FetchNgwItemsOptions } from '../../packages/ngw-kit/src/interfaces';

describe('NGW feature filters', () => {
  it('converts id filters to the NGW fid expression', () => {
    expect(propertiesFilterToExpression([['id', 'eq', 1]])).to.deep.equal([
      'all',
      ['==', ['fid'], 1],
    ]);
  });

  it('converts ilike filters with wildcard field markers', () => {
    const cases = [
      ['name', 'road'],
      ['%name', '%road'],
      ['name%', 'road%'],
      ['%name%', '%road%'],
    ] as const;

    for (const [field, pattern] of cases) {
      expect(
        propertiesFilterToExpression([[field, 'ilike', 'road']]),
      ).to.deep.equal(['all', ['ilike', ['get', 'name'], pattern]]);
    }
  });

  it('rejects like filters unsupported by NGW FilterExpression', () => {
    expect(() =>
      propertiesFilterToExpression([['name', 'like', 'Road']]),
    ).to.throw('Operator "like" is not supported');
  });

  it('sends a logical filter as one expression request', async () => {
    const requests: Array<{ query?: Record<string, unknown> }> = [];
    const connector = {
      route: () => ({
        get: (options: { query?: Record<string, unknown> }) => {
          requests.push(options);
          return Promise.resolve([]);
        },
      }),
    } as unknown as FetchNgwItemsOptions['connector'];

    await fetchNgwLayerItems({
      connector,
      resourceId: 1,
      filters: ['any', ['status', 'eq', 'active'], ['priority', 'ge', 5]],
    });

    expect(requests).to.have.length(1);
    expect(requests[0].query).to.include({
      filter: JSON.stringify([
        'any',
        ['==', ['get', 'status'], 'active'],
        ['>=', ['get', 'priority'], 5],
      ]),
    });
    expect(Object.keys(requests[0].query ?? {})).not.to.satisfy(
      (keys: string[]) => keys.some((key) => key.startsWith('fld_')),
    );
  });
});
