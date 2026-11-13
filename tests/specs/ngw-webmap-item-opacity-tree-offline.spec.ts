import { EventEmitter } from 'events';
import { describe, expect, it, vi } from 'vitest';

import { NgwWebmapItem } from '../../packages/ngw-kit/src/NgwWebmapItem';

import type {
  TreeGroup,
  TreeLayer,
  TreeRoot,
} from '../../packages/ngw-kit/src/interfaces';
import type { NgwWebmapItemOptions } from '../../packages/ngw-kit/src/NgwWebmapItem';
import type { WebmapLayerOpacityPropertyHandler } from '../../packages/ngw-kit/src/utils/WebmapLayerOpacityPropertyHandler';
import type { LayerAdapter } from '../../packages/webmap/src/interfaces/LayerAdapter';

function layer(id: number, transparency = 0): TreeLayer {
  return {
    item_type: 'layer',
    display_name: `Layer ${id}`,
    layer_adapter: 'image',
    layer_enabled: true,
    layer_style_id: id,
    layer_transparency: transparency,
    layer_identifiable: true,
    style_parent_id: id,
  } as TreeLayer;
}

function group(children: (TreeLayer | TreeGroup)[] = []): TreeGroup {
  return {
    item_type: 'group',
    display_name: 'Section',
    group_expanded: true,
    group_enabled: true,
    group_exclusive: false,
    children,
  };
}

function mockWebMap() {
  const setLayerOpacity = vi.fn();
  const showLayer = vi.fn();
  const hideLayer = vi.fn();
  const created = {
    id: 'created',
    options: { opacity: 1 },
  } as unknown as LayerAdapter;
  const addLayer = vi.fn().mockResolvedValue(created);
  const isLayerVisible = vi.fn().mockReturnValue(false);
  const emitter = new EventEmitter();
  const webMap = {
    setLayerOpacity,
    showLayer,
    hideLayer,
    addLayer,
    isLayerVisible,
    emitter,
  } as unknown as NgwWebmapItemOptions['webMap'];
  return {
    webMap,
    setLayerOpacity,
    showLayer,
    hideLayer,
    addLayer,
    isLayerVisible,
    emitter,
    created,
  };
}

function make(
  webMap: NgwWebmapItemOptions['webMap'],
  item: TreeLayer | TreeGroup | TreeRoot,
  parent?: NgwWebmapItem,
): NgwWebmapItem {
  const node = new NgwWebmapItem({ webMap, item, parent, noInit: true });
  if (parent) parent.tree.addChild(node);
  return node;
}

function attach(node: NgwWebmapItem, opacity?: number): LayerAdapter {
  const result = {
    id: `layer-${node.id}`,
    options: { opacity },
  } as unknown as LayerAdapter;
  node.layer = result;
  return result;
}

function opacity(node: NgwWebmapItem): WebmapLayerOpacityPropertyHandler {
  return node.properties.property(
    'opacity',
  ) as WebmapLayerOpacityPropertyHandler;
}

class InspectItem extends NgwWebmapItem {
  layerOptions(item: TreeGroup | TreeLayer): Record<string, unknown> {
    return this.getItemOptions(item);
  }
}

describe('NGW nested webmap opacity and item options (offline)', () => {
  it('reads current native layer opacity and uses one when no layer exists', () => {
    const { webMap } = mockWebMap();
    const item = make(webMap, layer(7));
    const property = opacity(item);
    expect(property.getProperty()).toBe(1);
    const native = attach(item, 0.65);
    expect(property.getProperty()).toBe(0.65);
    native.options.opacity = undefined;
    expect(property.getProperty()).toBe(1);
    native.options.opacity = 0;
    expect(property.getProperty()).toBe(0);
  });

  it('applies an explicit opacity change to the matching WebMap layer', () => {
    const { webMap, setLayerOpacity } = mockWebMap();
    const item = make(webMap, layer(9));
    const native = attach(item, 0.8);
    opacity(item).set(0.35);
    expect(setLayerOpacity).toHaveBeenCalledOnce();
    expect(setLayerOpacity).toHaveBeenCalledWith(native, 0.35);
    expect(native.options.opacity).toBe(0.35);
    expect(opacity(item).get()).toBe(0.35);
  });

  it('multiplies a leaf opacity by the parent group opacity', () => {
    const { webMap, setLayerOpacity } = mockWebMap();
    const parent = make(webMap, group());
    const leaf = make(webMap, layer(10), parent);
    const native = attach(leaf, 1);
    opacity(parent).set(0.5);
    expect(setLayerOpacity).toHaveBeenLastCalledWith(native, 0.5);
    opacity(leaf).set(0.6);
    expect(setLayerOpacity).toHaveBeenLastCalledWith(native, 0.3);
    expect(native.options.opacity).toBe(0.3);
    expect(opacity(leaf).get()).toBe(0.6);
  });

  it('multiplies opacity through two ancestor groups', () => {
    const { webMap, setLayerOpacity } = mockWebMap();
    const top = make(webMap, group());
    const middle = make(webMap, group(), top);
    const leaf = make(webMap, layer(3), middle);
    const native = attach(leaf, 1);
    opacity(top).set(0.5);
    opacity(middle).set(0.4);
    opacity(leaf).set(0.5);
    expect(setLayerOpacity).toHaveBeenLastCalledWith(native, 0.1);
    expect(native.options.opacity).toBeCloseTo(0.1);
  });

  it('propagates group opacity as individual child values', () => {
    const { webMap, setLayerOpacity } = mockWebMap();
    const parent = make(webMap, group());
    const first = make(webMap, layer(1), parent);
    const second = make(webMap, layer(2), parent);
    const layerOne = attach(first, 1);
    const layerTwo = attach(second, 1);
    opacity(parent).set(0.25, { propagation: true });
    expect(opacity(parent).get()).toBe(1);
    expect(opacity(first).get()).toBe(0.25);
    expect(opacity(second).get()).toBe(0.25);
    expect(layerOne.options.opacity).toBe(0.25);
    expect(layerTwo.options.opacity).toBe(0.25);
    expect(setLayerOpacity).toHaveBeenCalledWith(layerOne, 0.25);
    expect(setLayerOpacity).toHaveBeenCalledWith(layerTwo, 0.25);
  });

  it('reflects changes in group and leaf visibility without rendering them', () => {
    const { webMap, showLayer, hideLayer } = mockWebMap();
    const parent = make(webMap, group());
    const raw = layer(8);
    const leaf = make(webMap, raw, parent);
    const native = attach(leaf);
    parent.properties.set('visibility', false);
    expect(parent.item).toHaveProperty('group_enabled', false);
    expect(leaf.properties.property('visibility').isBlocked()).toBe(true);
    parent.properties.set('visibility', true);
    leaf.properties.set('visibility', false);
    expect(raw.layer_enabled).toBe(false);
    expect(hideLayer).toHaveBeenCalledWith(native, undefined);
    leaf.properties.set('visibility', true);
    expect(showLayer).toHaveBeenCalledWith(native, undefined);
  });

  it('derives root visibility from enabled descendant layers', () => {
    const { webMap } = mockWebMap();
    const first = layer(1);
    first.layer_enabled = false;
    const second = layer(2);
    const tree: TreeRoot = {
      item_type: 'root',
      children: [group([first, second])],
    } as TreeRoot;
    const item = make(webMap, tree);
    expect(item.properties.get('visibility')).toBe(true);
    expect(second.draw_order_position).toBe(2);
    expect(first.draw_order_position).toBe(1);
  });

  it('translates NGW transparency, metadata and projection limits into options', () => {
    const { webMap } = mockWebMap();
    const raw = layer(15, 35);
    raw.url = 'https://example.invalid/render';
    const item = new InspectItem({
      webMap,
      item: group(),
      noInit: true,
      options: {
        minZoom: 3,
        maxZoom: 14,
        popupOptions: { popupContent: 'Feature' },
      },
    });
    const options = item.layerOptions(raw);
    expect(options).toMatchObject({
      visibility: false,
      name: 'Layer 15',
      opacity: 0.65,
      url: 'https://example.invalid/render',
      minZoom: 3,
      maxZoom: 14,
      interactive: true,
      popupOptions: { popupContent: 'Feature' },
    });
  });

  it('computes a stable ordering from root draw positions', () => {
    const { webMap } = mockWebMap();
    const first = layer(1);
    const second = layer(2);
    const root: TreeRoot = {
      item_type: 'root',
      children: [group([first, second])],
    } as TreeRoot;
    const item = new InspectItem({
      webMap,
      item: root,
      noInit: true,
      options: { order: 6, drawOrderEnabled: true },
    });
    const a = item.layerOptions(first);
    const b = item.layerOptions(second);
    expect(a.order).toBeGreaterThan(b.order as number);
    expect(a.name).toBe('Layer 1');
    expect(b.name).toBe('Layer 2');
  });

  it('creates a native layer, assigns NGW opacity and observes visibility changes', async () => {
    const { webMap, addLayer, setLayerOpacity, emitter, created, hideLayer } =
      mockWebMap();
    const raw = layer(45, 25);
    const item = make(webMap, raw);
    await item.initItem(raw);
    expect(addLayer).toHaveBeenCalledWith(
      'IMAGE',
      expect.objectContaining({ name: 'Layer 45', opacity: 0.75 }),
    );
    expect(item.getLayer()).toBe(created);
    expect(raw._layer).toBe(created);
    expect(setLayerOpacity).toHaveBeenCalledWith(created, 0.75);
    emitter.emit('layer-created:toggle');
    expect(raw.layer_enabled).toBe(false);
    expect(hideLayer).toHaveBeenCalledWith(created, undefined);
  });

  it('uses an existing native layer without creating a replacement', async () => {
    const { webMap, addLayer } = mockWebMap();
    const raw = layer(12);
    const existing = { id: 'existing', options: {} } as unknown as LayerAdapter;
    Object.assign(raw, { layer_adapter: '', _layer: existing });
    const item = make(webMap, raw);
    await item.initItem(raw);
    expect(item.layer).toBe(existing);
    expect(addLayer).not.toHaveBeenCalled();
  });

  it('rejects a layer definition without an adapter or existing native layer', async () => {
    const { webMap } = mockWebMap();
    const raw = layer(13);
    Object.assign(raw, { layer_adapter: '' });
    const item = make(webMap, raw);
    await expect(item.initItem(raw)).rejects.toBe('No layer added');
  });

  it('creates group descendants in reverse display order', async () => {
    const { webMap, addLayer } = mockWebMap();
    const alpha = group();
    alpha.display_name = 'Alpha';
    const beta = group();
    beta.display_name = 'Beta';
    const raw = group([alpha, beta]);
    const item = make(webMap, raw);
    await item.initItem(raw);
    expect(
      item.tree.getChildren().map((child) => child.item.display_name),
    ).toEqual(['Beta', 'Alpha']);
    expect(addLayer).not.toHaveBeenCalled();
  });

  it('derives zoom thresholds from NGW scale denominators', () => {
    const { webMap } = mockWebMap();
    const item = new InspectItem({ webMap, item: group(), noInit: true });
    const raw = layer(17);
    raw.layer_min_scale_denom = 100000;
    raw.layer_max_scale_denom = 1000;
    const settings = item.layerOptions(raw);
    expect(settings.minZoom).toBeTypeOf('number');
    expect(settings.maxZoom).toBeTypeOf('number');
    expect(Number.isFinite(settings.minZoom as number)).toBe(true);
    expect(Number.isFinite(settings.maxZoom as number)).toBe(true);
  });
});
