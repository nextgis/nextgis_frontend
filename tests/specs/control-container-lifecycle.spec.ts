import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ControlContainer } from '../../packages/control-container/src/ControlContainer';
import {
  createButtonControl,
  createControl,
  createControlElement,
  createToggleControl,
} from '../../packages/control-container/src/controls/createControl';
import { getControlOptions } from '../../packages/control-container/src/controlOptions';

import type { MapControl } from '../../packages/control-container/src/interfaces';

function element(id: string): HTMLElement {
  const node = document.createElement('div');
  node.id = id;
  return node;
}

function simpleControl(id: string): MapControl {
  return {
    onAdd: () => element(id),
    onRemove: () => undefined,
  };
}

describe('ControlContainer DOM lifecycle and ordering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-map"></div>';
  });

  it('creates four position containers and attaches/detaches the wrapper', () => {
    const controls = new ControlContainer({ classPrefix: 'test' });
    const host = document.getElementById('test-map')!;
    controls.addTo(host);

    expect(host.contains(controls.getContainer())).toBe(true);
    expect(controls.getContainer().classList.contains('test-control-container'))
      .toBe(true);
    for (const position of [
      'top-right', 'top-left', 'bottom-right', 'bottom-left',
    ] as const) {
      expect(controls.getPositionContainer(position)).toBeInstanceOf(HTMLElement);
    }

    controls.detach();
    expect(host.contains(controls.getContainer())).toBe(false);
  });

  it('inserts top-position controls in ascending order', () => {
    const controls = new ControlContainer();
    controls.append(element('late'), 'top-left', 20);
    controls.append(element('early'), 'top-left', 5);
    controls.append(element('middle'), 'top-left', 10);

    const root = controls.getPositionContainer('top-left')!;
    expect(Array.from(root.children, (child) => child.id))
      .toEqual(['early', 'middle', 'late']);
  });

  it('reverses visual order for bottom-position controls', () => {
    const controls = new ControlContainer();
    controls.append(element('first'), 'bottom-left', 1);
    controls.append(element('second'), 'bottom-left', 2);
    controls.append(element('third'), 'bottom-left', 3);

    const root = controls.getPositionContainer('bottom-left')!;
    expect(Array.from(root.children, (child) => child.id))
      .toEqual(['third', 'second', 'first']);
  });

  it('creates and registers controls with their own DOM content', () => {
    const controls = new ControlContainer({ map: { kind: 'fake' } });
    const onAdd = vi.fn(() => element('content'));
    const control: MapControl = { onAdd, onRemove: vi.fn() };

    const wrapper = controls.addControl(control, 'top-right', { id: 'menu', order: 8 });

    expect(onAdd).toHaveBeenCalledWith({ kind: 'fake' });
    expect(wrapper).toBeInstanceOf(HTMLElement);
    expect(wrapper!.querySelector('#content')).toBeInstanceOf(HTMLElement);
    expect(wrapper!.style.order).toBe('8');
  });

  it('keeps nested controls pending until their target is registered', () => {
    const controls = new ControlContainer();
    const nested = element('nested');
    controls.append(nested, { inside: 'menu' }, 4);
    expect(nested.parentElement).toBeNull();

    controls.addControl(simpleControl('menu-content'), 'top-left', { id: 'menu' });

    const menu = controls.getPositionContainer('top-left')!;
    expect(menu.querySelector('#nested')).toBe(nested);
  });

  it('can remove a pending child before its target appears', () => {
    const controls = new ControlContainer();
    const pending = element('pending');
    controls.append(pending, { inside: 'menu' }, 1);
    controls.removeTarget(pending);
    controls.addControl(simpleControl('menu-content'), 'top-left', { id: 'menu' });

    expect(controls.getContainer().querySelector('#pending')).toBeNull();
  });

  it('removes an inserted target without removing its siblings', () => {
    const controls = new ControlContainer();
    const first = element('first');
    const second = element('second');
    controls.append(first, 'top-left', 1);
    controls.append(second, 'top-left', 2);

    controls.removeTarget(first);

    expect(first.parentElement).toBeNull();
    expect(controls.getPositionContainer('top-left')!.contains(second)).toBe(true);
  });

  it('honors externally provided position containers without taking ownership', () => {
    const topLeft = element('external-top-left');
    document.body.appendChild(topLeft);
    const controls = new ControlContainer({
      positionContainers: { 'top-left': topLeft },
    });

    controls.addTo('test-map');
    controls.append(element('control'), 'top-left', 1);
    expect(topLeft.querySelector('#control')).toBeInstanceOf(HTMLElement);
    controls.detach();
    expect(document.body.contains(topLeft)).toBe(true);
    expect(topLeft.querySelector('#control')).toBeNull();
  });

  it('preserves layout options on a created control', () => {
    const control = simpleControl('inner');
    const root = createControlElement(control, {
      bar: true,
      direction: 'horizontal',
      gap: 0,
      align: 'end',
      addClass: 'custom-control',
    });

    expect(root.classList.contains('webmap-ctrl-group')).toBe(true);
    expect(root.classList.contains('webmap-ctrl-horizontal')).toBe(true);
    expect(root.classList.contains('webmap-ctrl-gapless')).toBe(true);
    expect(root.classList.contains('custom-control')).toBe(true);
    expect(root.style.getPropertyValue('--webmap-ctrl-gap')).toBe('0px');
    expect(root.style.getPropertyValue('--webmap-ctrl-align')).toBe('flex-end');
    expect(getControlOptions(root)?.gap).toBe(0);
  });

  it('creates clickable controls and calls their removal hook', () => {
    const controls = new ControlContainer();
    const clicked = vi.fn();
    const control = createButtonControl({
      html: 'Open', title: 'Open menu', onClick: clicked,
    });
    const wrapper = controls.addControl(control, 'top-right')!;
    const button = wrapper.querySelector('button')!;

    expect(button.textContent).toBe('Open');
    expect(button.title).toBe('Open menu');
    button.click();
    expect(clicked).toHaveBeenCalledOnce();

    control.remove?.();
    expect(button.isConnected).toBe(false);
  });

  it('updates toggle markup, CSS classes and observers on each status change', () => {
    const controls = new ControlContainer();
    const toggle = createToggleControl({
      status: false,
      html: { on: 'ON', off: 'OFF' },
      title: { on: 'Enabled', off: 'Disabled' },
      addClassOn: 'is-on',
      addClassOff: 'is-off',
    });
    const statusChanged = vi.fn();
    const unsubscribe = toggle.onStatusChange(statusChanged);
    const wrapper = controls.addControl(toggle, 'top-left')!;

    expect(wrapper.textContent).toContain('OFF');
    toggle.onClick();
    expect(toggle.getStatus()).toBe(true);
    expect(wrapper.textContent).toContain('ON');
    expect(wrapper.querySelector('.is-on')).not.toBeNull();
    expect(statusChanged).toHaveBeenCalledOnce();

    unsubscribe();
    toggle.onClick();
    expect(toggle.getStatus()).toBe(false);
    expect(statusChanged).toHaveBeenCalledOnce();
  });

  it('honors disableOnSecondClick while allowing an explicit off action', () => {
    const toggle = createToggleControl({
      status: true,
      disableOnSecondClick: true,
    });

    toggle.onClick();
    expect(toggle.getStatus()).toBe(true);
    toggle.onClick(false);
    expect(toggle.getStatus()).toBe(false);
  });

  it('keeps a switch group mutually exclusive', () => {
    const controls = new ControlContainer();
    const first = createToggleControl({ switch: 'base', status: true });
    const second = createToggleControl({ switch: 'base', status: false });
    controls.addControl(first, 'top-left');
    controls.addControl(second, 'top-left');

    second.onClick(true);

    expect(first.getStatus()).toBe(false);
    expect(second.getStatus()).toBe(true);
  });

  it('does not switch off controls in a different group', () => {
    const controls = new ControlContainer();
    const first = createToggleControl({ switch: 'group-a', status: true });
    const second = createToggleControl({ switch: 'group-b', status: false });
    controls.addControl(first, 'top-left');
    controls.addControl(second, 'top-left');

    second.onClick(true);

    expect(first.getStatus()).toBe(true);
    expect(second.getStatus()).toBe(true);
  });

  it('restores the previous toggle state when the click callback throws', () => {
    const toggle = createToggleControl({
      status: false,
      onClick: () => { throw new Error('Cannot toggle'); },
    });

    expect(() => toggle.onClick()).toThrow('Cannot toggle');
    expect(toggle.getStatus()).toBe(false);
  });

  it('wraps a custom control and forwards removal to its source', () => {
    const source = simpleControl('custom');
    const onRemove = vi.spyOn(source, 'onRemove');
    const wrapped = createControl(source, { bar: true });
    const root = wrapped.onAdd({});
    document.body.appendChild(root!);

    expect(root?.querySelector('#custom')).not.toBeNull();
    wrapped.remove?.();
    expect(onRemove).toHaveBeenCalledOnce();
    expect(document.body.contains(root!)).toBe(false);
  });
});
