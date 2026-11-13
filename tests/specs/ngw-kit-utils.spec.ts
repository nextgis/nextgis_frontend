import { describe, expect, it, vi } from 'vitest';

import { createLayerSymbolParam } from '../../packages/ngw-kit/src/utils/createLayerSymbolParam';
import { mapFeatureDisplayName } from '../../packages/ngw-kit/src/utils/mapFeatureDisplayName';
import { parseDate, parseDateFromNgw } from '../../packages/ngw-kit/src/utils/parseDateFromNgw';
import { prepareFieldsToNgw } from '../../packages/ngw-kit/src/utils/prepareFieldsToNgw';

describe('NGW kit utility functions', () => {
  it('serializes symbol intervals for a resource', () => {
    expect(createLayerSymbolParam(42, [1, 2, '3'])).toEqual({ 'symbols[42]': '1,2,3' });
    expect(createLayerSymbolParam(42, [])).toEqual({ 'symbols[42]': undefined });
  });

  it('parses NGW date and datetime structures', () => {
    expect(parseDate('2026-11-13')).toBe('2026-11-13');
    expect(parseDate({ year: 2026, month: 11, day: 13 })).toBe('2026-11-13');
    expect(parseDateFromNgw({
      year: 2026, month: 11, day: 13, hour: 14, minute: 5, second: 9,
    })).toBe('2026-11-13 14:5:9');
  });

  it('maps feature field names to NGW display names', async () => {
    const getResource = vi.fn().mockResolvedValue({
      feature_layer: {
        fields: [
          { keyname: 'label', display_name: 'Display label' },
          { keyname: 'other', display_name: 'Other field' },
        ],
      },
    });
    const connector = { getResource } as unknown as Parameters<typeof mapFeatureDisplayName>[0]['connector'];
    const signal = new AbortController().signal;

    await expect(mapFeatureDisplayName({
      connector, resourceId: 42, fields: ['label', 'missing'], signal, cache: false,
    })).resolves.toEqual(['Display label', 'missing']);
    expect(getResource).toHaveBeenCalledWith(42, { signal, cache: false });
  });

  it('returns original field names for resources without a feature layer', async () => {
    const connector = {
      getResource: vi.fn().mockResolvedValue({}),
    } as unknown as Parameters<typeof mapFeatureDisplayName>[0]['connector'];
    await expect(mapFeatureDisplayName({
      connector, resourceId: 42, fields: ['id', 'name'],
    })).resolves.toEqual(['id', 'name']);
  });

  it('rejects display name lookup without a resource', () => {
    const connector = {} as Parameters<typeof mapFeatureDisplayName>[0]['connector'];
    expect(() => mapFeatureDisplayName({ connector, fields: ['name'] })).toThrow(
      'The `resource` or `resourceId` is required',
    );
  });

  it('converts numeric, boolean and string values to NGW fields', () => {
    const fields = [
      { keyname: 'integer', datatype: 'INTEGER' },
      { keyname: 'real', datatype: 'REAL' },
      { keyname: 'enabled', datatype: 'BOOLEAN' },
      { keyname: 'title', datatype: 'STRING' },
    ] as const;
    expect(prepareFieldsToNgw(
      { integer: '12', real: '3.5', enabled: 1, title: 'Layer', ignored: 'value' },
      [...fields],
    )).toEqual({ integer: 12, real: 3.5, enabled: true, title: 'Layer' });
  });

  it('preserves explicit nulls and handles invalid boolean input', () => {
    expect(prepareFieldsToNgw(
      { title: 'null', enabled: 'yes', quantity: undefined },
      [
        { keyname: 'title', datatype: 'STRING' },
        { keyname: 'enabled', datatype: 'BOOLEAN' },
        { keyname: 'quantity', datatype: 'INTEGER' },
      ],
    )).toEqual({ title: null, enabled: null, quantity: null });
  });
});
