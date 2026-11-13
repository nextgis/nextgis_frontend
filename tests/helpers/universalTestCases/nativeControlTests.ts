import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Type } from '@nextgis/utils';
import type { MapAdapter } from '../../../packages/webmap/src';
import type { WebMap } from '../../../packages/webmap/src/WebMap';

import { mapHtml } from '../mapHtml';
import { buildWebMap } from './webMapTests';

/** Exercise the same public WebMap control API on every real map engine. */
export function nativeControlTests(MA: Type<MapAdapter>): void {
  describe(`${MA.name}: native controls through WebMap`, () => {
    let map: WebMap;

    beforeEach(async () => {
      document.body.innerHTML = mapHtml;
      map = await buildWebMap(MA, { target: 'map' });
    });

    afterEach(() => {
      map.destroy();
      vi.restoreAllMocks();
    });

    it('mounts a clickable button in the map and forwards clicks', async () => {
      const onClick = vi.fn();
      const button = await map.createButtonControl({
        html: 'Open tools', title: 'Open tools', onClick,
      });
      expect(button).toBeDefined();
      if (!button) return;

      await map.addControl(button, 'top-left', { id: 'tools', order: 4 });
      const container = map.getControlContainer();
      expect(container).toBeInstanceOf(HTMLElement);
      await vi.waitFor(() => {
        const element = [...(container?.querySelectorAll('button') || [])]
          .find((item) => item.textContent?.includes('Open tools'));
        expect(element).toBeDefined();
        element!.click();
      });
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('mounts two independently clickable buttons', async () => {
      const firstClick = vi.fn();
      const secondClick = vi.fn();
      const first = await map.createButtonControl({ html: 'First', onClick: firstClick });
      const second = await map.createButtonControl({ html: 'Second', onClick: secondClick });
      expect(first).toBeDefined();
      expect(second).toBeDefined();
      if (!first || !second) return;

      await map.addControl(first, 'bottom-right', { order: 20 });
      await map.addControl(second, 'bottom-right', { order: 5 });

      await vi.waitFor(() => {
        const buttons = [...(map.getControlContainer()?.querySelectorAll('button') || [])]
          .filter((b) => b.textContent === 'First' || b.textContent === 'Second');
        expect(buttons).toHaveLength(2);
      });
      const buttons = [...(map.getControlContainer()?.querySelectorAll('button') || [])];
      buttons.find((b) => b.textContent === 'First')!.click();
      buttons.find((b) => b.textContent === 'Second')!.click();
      expect(firstClick).toHaveBeenCalledOnce();
      expect(secondClick).toHaveBeenCalledOnce();
    });

    it('creates a toggle that changes its state and displayed content', async () => {
      const onClick = vi.fn();
      const toggle = await map.createToggleControl({
        status: false,
        html: { on: 'Enabled', off: 'Disabled' },
        onClick,
      });
      expect(toggle).toBeDefined();
      if (!toggle) return;
      await map.addControl(toggle, 'top-right');

      await vi.waitFor(() => {
        expect(map.getControlContainer()?.textContent).toContain('Disabled');
      });
      expect(toggle.getStatus()).toBe(false);
      toggle.onClick(true);
      expect(toggle.getStatus()).toBe(true);
      await vi.waitFor(() => {
        expect(map.getControlContainer()?.textContent).toContain('Enabled');
      });
      expect(onClick).toHaveBeenCalledWith(true);
      toggle.onClick(false);
      expect(toggle.getStatus()).toBe(false);
    });

    it('creates an arbitrary DOM control and calls its onRemove hook', async () => {
      const onRemove = vi.fn();
      const onAdd = vi.fn(() => {
        const element = document.createElement('div');
        element.id = 'custom-map-control';
        element.textContent = 'Custom content';
        return element;
      });
      const control = await map.createControl({ onAdd, onRemove }, { addClass: 'custom' });
      expect(control).toBeDefined();
      if (!control) return;
      await map.addControl(control, 'bottom-left');
      await vi.waitFor(() => {
        expect(map.getContainer()?.querySelector('#custom-map-control')).not.toBeNull();
      });
      expect(onAdd).toHaveBeenCalled();

      map.removeControl(control);
      await vi.waitFor(() => expect(onRemove).toHaveBeenCalledOnce());
      await vi.waitFor(() => {
        expect(map.getContainer()?.querySelector('#custom-map-control')).toBeNull();
      });
    });

    it('accepts nested control positions through the shared interface', async () => {
      const child = await map.createButtonControl({ html: 'Child action', onClick: vi.fn() });
      const parent = await map.createButtonControl({ html: 'Parent action', onClick: vi.fn() });
      expect(child).toBeDefined();
      expect(parent).toBeDefined();
      if (!child || !parent) return;

      await map.addControl(parent, 'top-left', { id: 'parent-menu' });
      await map.addControl(child, { inside: 'parent-menu' });
      await vi.waitFor(() => {
        const container = map.getControlContainer();
        expect(container?.textContent).toContain('Parent action');
        expect(container?.textContent).toContain('Child action');
      });
    });
  });
}
