import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Map as LeafletMap } from 'leaflet';
import OlMap from 'ol/Map';
import View from 'ol/View';
import Control from 'ol/control/Control';

import {
  LeafletControlContainer,
} from '../../packages/leaflet-control-container/src/LeafletControlContainer';
import { createButtonControl as leafletButton } from '../../packages/leaflet-control-container/src/createButtonControl';
import { createControl as leafletControl } from '../../packages/leaflet-control-container/src/createControl';
import { createToggleControl as leafletToggle } from '../../packages/leaflet-control-container/src/createToggleControl';
import { MaplibreGLControlContainer } from '../../packages/maplibre-gl-control-container/src/MaplibreGLControlContainer';
import { createButtonControl as maplibreButton } from '../../packages/maplibre-gl-control-container/src/createButtonControl';
import { createControl as maplibreControl } from '../../packages/maplibre-gl-control-container/src/createControl';
import { createToggleControl as maplibreToggle } from '../../packages/maplibre-gl-control-container/src/createToggleControl';
import { OlControlContainer } from '../../packages/ol-control-container/src/OlControlContainer';
import { createButtonControl as olButton } from '../../packages/ol-control-container/src/createButtonControl';
import { createControl as olControl } from '../../packages/ol-control-container/src/createControl';
import { createToggleControl as olToggle } from '../../packages/ol-control-container/src/createToggleControl';

import type { IControl, Map as MaplibreMap } from 'maplibre-gl';

const host = (): HTMLDivElement => {
  const element = document.createElement('div');
  element.style.width = '600px';
  element.style.height = '400px';
  document.body.appendChild(element);
  return element;
};

const content = (text: string): HTMLElement => {
  const node = document.createElement('div');
  node.textContent = text;
  return node;
};

describe('Leaflet-specific control container lifecycle', () => {
  let map: LeafletMap;
  let panel: LeafletControlContainer;

  beforeEach(() => {
    document.body.innerHTML = '';
    map = new LeafletMap(host(), {
      zoomControl: false,
      attributionControl: false,
    }).setView([0, 0], 3);
    panel = new LeafletControlContainer(map);
  });

  afterEach(() => {
    panel.detach();
    map.remove();
    vi.restoreAllMocks();
  });

  it('mounts a button into the native corner and removes its ID registration', () => {
    const clicked = vi.fn();
    const button = leafletButton({ html: 'Leaflet action', onClick: clicked });
    expect(panel.addControl(button, 'top-left', { id: 'leaflet-action', order: 4 })).toBe(button);
    const nativeButton = panel.getContainer().querySelector('button');
    expect(nativeButton?.textContent).toContain('Leaflet action');
    nativeButton?.click();
    expect(clicked).toHaveBeenCalledOnce();
    panel.removeControl(button);
    expect(panel.getContainer().querySelector('button')).toBeNull();
    // Re-registering this ID must not target the old, detached control.
    panel.append(content('Replacement'), { inside: 'leaflet-action' });
    expect(panel.getContainer().textContent).not.toContain('Replacement');
  });

  it('adds an initially pending child when its parent ID is registered', () => {
    const child = leafletButton({ html: 'Child', onClick: vi.fn() });
    const parent = leafletButton({ html: 'Parent', onClick: vi.fn() });
    panel.addControl(child, { inside: 'leaflet-parent' });
    panel.addControl(parent, 'top-right', { id: 'leaflet-parent' });
    expect(parent.getContainer()?.textContent).toContain('Child');
  });

  it('creates a native toggle that preserves its public status methods', () => {
    const toggle = leafletToggle({
      status: false,
      html: { on: 'Active', off: 'Inactive' },
      disableOnSecondClick: true,
    });
    panel.addControl(toggle, 'bottom-left');
    expect(toggle.getStatus()).toBe(false);
    toggle.onClick(true);
    expect(toggle.getStatus()).toBe(true);
    toggle.onClick();
    expect(toggle.getStatus()).toBe(true);
    toggle.onClick(false);
    expect(toggle.getStatus()).toBe(false);
  });

  it('forwards native control removal to the original source', () => {
    const removed = vi.fn();
    const wrapped = leafletControl({ onAdd: () => content('Custom'), onRemove: removed });
    panel.addControl(wrapped, 'bottom-right');
    panel.removeControl(wrapped);
    expect(removed).toHaveBeenCalledOnce();
  });

  it('supports explicit external ID registration and detaching', () => {
    const external = content('Menu');
    panel.append(external, 'top-left');
    panel.registerIDContainer('external-menu', external);
    panel.append(content('Nested'), { inside: 'external-menu' });
    expect(external.textContent).toContain('Nested');
    panel.unregisterIDContainer('external-menu');
    panel.detach();
    // Leaflet owns the native corner containers: detach removes our targets,
    // but must not destroy the controls DOM owned by the map.
    expect(panel.getContainer().isConnected).toBe(true);
    expect(external.isConnected).toBe(false);
    expect(panel.getContainer().contains(external)).toBe(false);
  });
});

describe('MapLibre-specific control container lifecycle', () => {
  let panel: MaplibreGLControlContainer;
  let nativeMap: MaplibreMap;
  let add: ReturnType<typeof vi.fn>;
  let remove: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    const container = host();
    const root = document.createElement('div');
    root.className = 'maplibregl-control-container';
    container.appendChild(root);
    for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      const el = document.createElement('div');
      el.className = `maplibregl-ctrl-${corner}`;
      root.appendChild(el);
    }
    // The native map is intentionally replaced only at the renderer boundary.
    // The tested control container and factories are the real implementations.
    const map = { getContainer: () => container } as unknown as MaplibreMap;
    add = vi.fn((control: IControl) => {
      control.onAdd(map);
      return map;
    });
    remove = vi.fn((control: IControl) => {
      control.onRemove?.(map);
      return map;
    });
    nativeMap = Object.assign(map, { addControl: add, removeControl: remove });
    panel = new MaplibreGLControlContainer(nativeMap);
  });

  afterEach(() => {
    panel.detach();
    vi.restoreAllMocks();
  });

  it('adds and removes a native button with its ID and click handler', () => {
    const clicked = vi.fn();
    const button = maplibreButton({ html: 'MapLibre action', onClick: clicked });
    expect(panel.addControl(button, 'bottom-right', { id: 'maplibre-action' })).toBe(button);
    expect(add).toHaveBeenCalledWith(button, 'bottom-right');
    const node = panel.getContainer().querySelector('button');
    expect(node?.textContent).toContain('MapLibre action');
    node?.click();
    expect(clicked).toHaveBeenCalledOnce();
    panel.removeControl(button);
    expect(remove).toHaveBeenCalledWith(button);
    expect(panel.getContainer().querySelector('button')).toBeNull();
  });

  it('mounts nested controls when their parent exists', () => {
    const parent = maplibreButton({ html: 'Menu', onClick: vi.fn() });
    const child = maplibreButton({ html: 'Inside', onClick: vi.fn() });
    panel.addControl(parent, 'top-left', { id: 'maplibre-menu' });
    panel.addControl(child, { inside: 'maplibre-menu' });
    expect(panel.getContainer().textContent).toContain('Inside');
    expect(add).toHaveBeenCalledWith(child, 'top-left');
  });

  it('preserves toggle state, observers and the second-click policy', () => {
    const toggle = maplibreToggle({ status: false, disableOnSecondClick: true });
    const observer = vi.fn();
    const unsubscribe = toggle.onStatusChange(observer);
    panel.addControl(toggle, 'top-right');
    toggle.onClick(true);
    expect(toggle.getStatus()).toBe(true);
    expect(observer).toHaveBeenCalledOnce();
    toggle.onClick();
    expect(toggle.getStatus()).toBe(true);
    toggle.onClick(false);
    expect(toggle.getStatus()).toBe(false);
    unsubscribe();
  });

  it('forwards removal to custom native control and detaches its DOM', () => {
    const onRemove = vi.fn();
    const control = maplibreControl({ onAdd: () => content('Custom'), onRemove });
    panel.addControl(control, 'top-left');
    expect(panel.getContainer().textContent).toContain('Custom');
    panel.removeControl(control);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(panel.getContainer().textContent).not.toContain('Custom');
  });

  it('uses external corner elements and can append standalone DOM nodes', () => {
    panel.append(content('Standalone'), 'bottom-left', 10);
    expect(panel.getContainer().querySelector('.maplibregl-ctrl-bottom-left')?.textContent)
      .toContain('Standalone');
    const root = content('Anchor');
    panel.registerIDContainer('anchor', root);
    panel.append(content('Child'), { inside: 'anchor' });
    expect(root.textContent).toContain('Child');
    panel.unregisterIDContainer('anchor');
  });
});

describe('OpenLayers-specific control container lifecycle', () => {
  let map: OlMap;
  let panel: OlControlContainer;

  beforeEach(() => {
    document.body.innerHTML = '';
    map = new OlMap({
      target: host(),
      controls: [],
      layers: [],
      view: new View({ center: [0, 0], zoom: 3 }),
    });
    panel = new OlControlContainer();
    map.addControl(panel);
  });

  afterEach(() => {
    map.setTarget(undefined);
    map.dispose();
    vi.restoreAllMocks();
  });

  it('mounts a button into the panel and can remove it', async () => {
    const clicked = vi.fn();
    const button = olButton({ html: 'OL action', onClick: clicked });
    await panel.addControl(button, 'top-left', { id: 'ol-action', order: 8 });
    const nativeButton = panel.getContainer().querySelector('button');
    expect(nativeButton?.textContent).toBe('OL action');
    nativeButton?.click();
    expect(clicked).toHaveBeenCalledOnce();
    panel.removeControl(button);
    expect(panel.getContainer().querySelector('button')).toBeNull();
  });

  it('accepts promised controls and maintains native group classes', async () => {
    const button = olButton({ html: 'Delayed', onClick: vi.fn(), margin: true });
    await panel.addControl(Promise.resolve(button), 'bottom-right', { order: 1 });
    expect(panel.getContainer().textContent).toContain('Delayed');
    expect(panel.getContainer().querySelector('.webmap-ctrl-margin')).not.toBeNull();
  });

  it('supports nesting inside another control ID', async () => {
    const parent = olButton({ html: 'Parent', onClick: vi.fn() });
    const child = olButton({ html: 'Child', onClick: vi.fn() });
    await panel.addControl(parent, 'top-left', { id: 'ol-parent' });
    await panel.addControl(child, { inside: 'ol-parent' });
    expect(panel.getContainer().textContent).toContain('Child');
  });

  it('keeps toggle methods connected to the actual OpenLayers control', async () => {
    const toggle = olToggle({ status: false, html: { on: 'On', off: 'Off' } });
    await panel.addControl(toggle, 'top-right');
    expect(toggle.getStatus()).toBe(false);
    toggle.onClick(true);
    expect(toggle.getStatus()).toBe(true);
    expect(panel.getContainer().textContent).toContain('On');
    toggle.onClick(false);
    expect(toggle.getStatus()).toBe(false);
  });

  it('notifies custom controls when OpenLayers detaches them', async () => {
    const onRemove = vi.fn();
    const nativeControl = olControl({ onAdd: () => content('Custom OL'), onRemove });
    await panel.addControl(nativeControl, 'bottom-left');
    expect(panel.getContainer().textContent).toContain('Custom OL');
    panel.removeControl(nativeControl);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('does not mount a control if its panel has no map', async () => {
    const unmounted = new OlControlContainer();
    const button: Control = olButton({ html: 'Unattached', onClick: vi.fn() });
    await unmounted.addControl(button, 'top-left');
    expect(unmounted.getContainer().querySelector('button')).toBeNull();
  });
});
