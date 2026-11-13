import { describe, expect, it, vi } from 'vitest';

import { extractError } from '../../packages/ngw-connector/src/errors/extractError';
import { isError } from '../../packages/ngw-connector/src/errors/isError';
import { NetworksResponseError } from '../../packages/ngw-connector/src/errors/NetworksResponseError';
import { getCompanyLogo } from '../../packages/ngw-kit/src/utils/getCompanyLogo';
import { getLayerFilterOptions } from '../../packages/ngw-kit/src/utils/getLayerFilterOptions';
import {
  addFeatureAttachment,
  deleteFeatureAttachment,
  uploadFeatureAttachment,
} from '../../packages/ngw-kit/src/utils/uploadFeatureAttachment';
import { isAnyJson, isJsonArray, isJsonMap } from '../../packages/utils/src/typeHelpers/Json';
import { isObjKey, keyInObj } from '../../packages/utils/src/typeHelpers/isObjKey';

import type NgwConnector from '@nextgis/ngw-connector';

describe('NGW feature attachment requests', () => {
  it('uploads a file and attaches its server metadata to a feature', async () => {
    const file = new File(['example'], 'test.txt', { type: 'text/plain' });
    const post = vi.fn()
      .mockResolvedValueOnce({ upload_meta: [{ id: 'upload-1', name: 'test.txt', size: 7, mime_type: 'text/plain' }] })
      .mockResolvedValueOnce({ id: 81 });
    const connector = { post } as unknown as NgwConnector;

    await expect(uploadFeatureAttachment({ connector, resourceId: 22, featureId: 3, file }))
      .resolves.toEqual({ id: 81 });
    expect(post).toHaveBeenNthCalledWith(1, 'file_upload.upload', { file });
    expect(post).toHaveBeenNthCalledWith(2, 'feature_attachment.collection', {
      data: {
        name: 'test.txt', size: 7, mime_type: 'text/plain',
        file_upload: { id: 'upload-1', size: 7 },
      },
    }, { id: 22, fid: 3 });
  });

  it('creates an attachment directly using existing file metadata', async () => {
    const post = vi.fn().mockResolvedValue({ id: 12 });
    const connector = { post } as unknown as NgwConnector;
    const fileMeta = { id: 'upload-2', name: 'file.png', size: 12, mime_type: 'image/png' };

    await expect(addFeatureAttachment({ connector, resourceId: 8, featureId: 5, fileMeta: fileMeta as never }))
      .resolves.toEqual({ id: 12 });
    expect(post).toHaveBeenCalledWith('feature_attachment.collection', expect.objectContaining({
      data: expect.objectContaining({ name: 'file.png' }),
    }), { id: 8, fid: 5 });
  });

  it('removes an attachment by all three NGW identifiers', async () => {
    const del = vi.fn().mockResolvedValue(undefined);
    const route = vi.fn().mockReturnValue({ delete: del });
    const connector = { route } as unknown as NgwConnector;

    await deleteFeatureAttachment({ connector, resourceId: 25, featureId: 6, attachmentId: 9 });
    expect(route).toHaveBeenCalledWith('feature_attachment.item', {
      id: 25, fid: 6, aid: 9,
    });
    expect(del).toHaveBeenCalledOnce();
  });
});

describe('NGW GeoJSON layer request options', () => {
  it('copies supported filter options and ignores unrelated settings', () => {
    const options = {
      fields: ['name'], intersects: [1, 2, 3, 4], limit: 0,
      orderBy: ['name'], strategy: 'BBOX', opacity: 0.5, id: 'roads',
    } as never;
    expect(getLayerFilterOptions(options)).toEqual({
      fields: ['name'], intersects: [1, 2, 3, 4], limit: 0,
      orderBy: ['name'], strategy: 'BBOX',
    });
  });

  it('preserves empty and zero filter parameters but skips undefined', () => {
    expect(getLayerFilterOptions({ fields: [], limit: 0, orderBy: undefined } as never))
      .toEqual({ fields: [], limit: 0 });
  });
});

describe('NGW company logo display', () => {
  it('does not request image data when the company logo is disabled', async () => {
    const route = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue({ company_logo: { enabled: false } }),
    });
    const connector = { route } as unknown as NgwConnector;

    expect(await getCompanyLogo(connector)).toBeUndefined();
    expect(route).toHaveBeenCalledOnce();
    expect(route).toHaveBeenCalledWith('pyramid.settings');
  });

  it('creates a linked logo from the NGW base64 image', async () => {
    const getSettings = vi.fn().mockResolvedValue({
      company_logo: { enabled: true, link: 'https://example.invalid/logo' },
    });
    const getImage = vi.fn().mockResolvedValue({
      pyramid: { header_logo: ['image/png', 'YWJj'] },
    });
    const route = vi.fn((name: string) => ({
      get: name === 'pyramid.settings' ? getSettings : getImage,
    }));
    const connector = { route } as unknown as NgwConnector;
    const createURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:offline-logo');
    try {
      const logo = await getCompanyLogo(connector, { padding: '5px', cssClass: 'brand-logo' });
      expect(logo?.tagName).toBe('A');
      expect(logo?.className).toContain('brand-logo');
      expect((logo as HTMLAnchorElement).href).toBe('https://example.invalid/logo');
      expect(logo?.querySelector('img')?.src).toBe('blob:offline-logo');
      expect(logo?.style.padding).toBe('5px');
      expect(route).toHaveBeenCalledWith('pyramid.csettings');
    } finally {
      createURL.mockRestore();
    }
  });

  it('returns no logo when NGW has not configured an image', async () => {
    const get = vi.fn().mockResolvedValueOnce({
      company_logo: { enabled: true, link: '' },
    }).mockResolvedValueOnce({ pyramid: {} });
    const connector = { route: () => ({ get }) } as unknown as NgwConnector;
    await expect(getCompanyLogo(connector)).resolves.toBeUndefined();
  });
});

describe('NGW error classification', () => {
  it('identifies complete NGW error responses', () => {
    expect(isError({ status_code: 403, exception: 'Forbidden', title: 'Denied' })).toBe(true);
    expect(isError({ status_code: 404, title: 'Missing' })).toBe(false);
    expect(isError(null)).toBe(false);
  });

  it('extracts messages, details and server data from known errors', () => {
    expect(extractError({
      name: 'NgwError', title: 'Failed', message: 'Cannot save',
      detail: 'Conflict', data: { data: { featureId: 5 } },
    })).toEqual({
      title: 'Failed', message: 'Cannot save',
      detail: 'Conflict', data: { featureId: 5 },
    });
  });

  it('marks responses without status as a network error', () => {
    const error = extractError({ exception: 'NetworkProblem', title: 'Disconnected' });
    expect(error).toBeInstanceOf(NetworksResponseError);
  });

  it('returns safe default titles and messages for unknown error objects', () => {
    expect(extractError({ status: 400 })).toEqual({
      title: 'Unexpected error', message: 'Something went wrong.',
    });
    expect(extractError('plain text')).toBeUndefined();
  });
});

describe('JSON data validation', () => {
  it('recognizes JSON primitives and rejects unsupported primitive types', () => {
    for (const value of [null, true, false, 0, 42, 'text']) {
      expect(isAnyJson(value)).toBe(true);
    }
    for (const value of [undefined, Symbol('not-json'), () => 5]) {
      expect(isAnyJson(value)).toBe(false);
    }
  });

  it('accepts nested arrays of valid JSON data', () => {
    expect(isAnyJson([1, { nested: [false, null, 'text'] }])).toBe(true);
    expect(isJsonArray([])).toBe(true);
    expect(isJsonArray([1, 'hello', null])).toBe(true);
  });

  it('rejects arrays with non-JSON values', () => {
    expect(isJsonArray([1, undefined])).toBe(false);
    expect(isJsonArray([1, new Date()])).toBe(false);
    expect(isJsonArray({ 0: 'text' })).toBe(false);
  });

  it('accepts plain JSON dictionaries, including empty and nested objects', () => {
    expect(isJsonMap({})).toBe(true);
    expect(isJsonMap({ key: 'value', nested: { list: [1, 2] } })).toBe(true);
    expect(isAnyJson({ ok: true })).toBe(true);
  });

  it('rejects dictionaries containing non-JSON values', () => {
    expect(isJsonMap({ bad: undefined })).toBe(false);
    expect(isJsonMap({ nested: { callback: () => 5 } })).toBe(false);
    expect(isJsonMap([])).toBe(false);
  });
});

describe('Object key type guards', () => {
  it('recognizes known string and numeric object keys', () => {
    expect(isObjKey({ title: 'Roads', 5: 'five' }, 'title')).toBe(true);
    expect(isObjKey({ 5: 'five' }, 5)).toBe(true);
    expect(isObjKey({ title: 'Roads' }, 'unknown')).toBe(false);
  });

  it('rejects unsupported key types and preserves the deprecated alias', () => {
    const obj = { enabled: true };
    expect(isObjKey(obj, Symbol('enabled'))).toBe(false);
    expect(isObjKey(obj, null)).toBe(false);
    expect(keyInObj(obj, 'enabled')).toBe(true);
    expect(keyInObj(obj, 'missing')).toBe(false);
  });
});
