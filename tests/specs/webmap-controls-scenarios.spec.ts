import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { WebMap } from '../../packages/webmap/src/WebMap';

describe('WebMap controls with a fake map engine', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(FakeMapAdapter, { target: 'map' });
  });

  afterEach(() => {
    map.destroy();
    vi.restoreAllMocks();
  });

  it('delegates creating a custom control to the map adapter', async () => {
    const onAdd = vi.fn(() => document.createElement('div'));
    const control = { onAdd, onRemove: vi.fn() };
    const create = vi.spyOn(map.mapAdapter, 'createControl');

    await map.createControl(control, { margin: true });

    expect(create).toHaveBeenCalledWith(control, { margin: true });
  });

  it('delegates creating a button to the map adapter', async () => {
    const options = { onClick: vi.fn(), title: 'Open' };
    const create = vi.spyOn(map.mapAdapter, 'createButtonControl');

    await map.createButtonControl(options);

    expect(create).toHaveBeenCalledWith(options);
  });

  it('uses the native toggle factory when the adapter supports it', async () => {
    const create = vi.spyOn(map.mapAdapter, 'createToggleControl');
    const options = { status: true };

    await map.createToggleControl(options);

    expect(create).toHaveBeenCalledWith(options);
  });

  it('builds a working toggle from a button factory as a fallback', async () => {
    const adapter = map.mapAdapter as FakeMapAdapter;
    adapter.createToggleControl = undefined;
    const createButton = vi.spyOn(adapter, 'createButtonControl');

    const control = await map.createToggleControl({ status: false });

    expect(createButton).toHaveBeenCalledOnce();
    expect(control?.getStatus()).toBe(false);
    control?.onClick(true);
    expect(control?.getStatus()).toBe(true);
  });

  it('forwards position, ID and ordering when adding a control', async () => {
    const add = vi.spyOn(map.mapAdapter, 'addControl');
    const control = { name: 'custom-control' };

    await map.addControl(control, 'bottom-right', { id: 'tools', order: 7 });

    expect(add).toHaveBeenCalledWith(control, 'bottom-right', {
      id: 'tools', order: 7,
    });
  });

  it('creates registered control adapter classes with options', () => {
    class CustomControl {
      constructor(public options?: Record<string, unknown>) {}
    }
    map.mapAdapter.controlAdapters.CUSTOM = CustomControl;

    const control = map.getControl('CUSTOM', { label: 'Test' });

    expect(control).toBeInstanceOf(CustomControl);
    expect((control as CustomControl).options).toEqual({ label: 'Test' });
    expect(map.getControl('DOES_NOT_EXIST')).toBeUndefined();
  });

  it('uses a control-specific remove method before the map adapter fallback', async () => {
    const removeAdapter = vi.spyOn(map.mapAdapter, 'removeControl');
    const removeOwn = vi.fn();

    map.removeControl({ remove: removeOwn });
    expect(removeOwn).toHaveBeenCalledOnce();
    expect(removeAdapter).not.toHaveBeenCalled();

    const bare = { name: 'plain' };
    map.removeControl(bare);
    await Promise.resolve();
    expect(removeAdapter).toHaveBeenCalledWith(bare);
  });
});
