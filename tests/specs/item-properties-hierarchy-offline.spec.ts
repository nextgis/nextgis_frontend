import { describe, expect, it, vi } from 'vitest';

import { Item } from '../../packages/item/src/Item';
import { BaseProperty } from '../../packages/item/src/properties/BaseProperty';
import { CheckProperty } from '../../packages/item/src/properties/CheckProperty';

class TextProperty extends BaseProperty<string> {
  attach(container: HTMLElement): void {
    this._container = container;
  }
}

function node(visible: boolean): Item {
  const item = new Item({
    properties: [{ name: 'visibility', type: 'boolean', value: visible }],
  });
  item.initProperties();
  return item;
}

function connect(parent: Item, child: Item): void {
  child.tree.setParent(parent);
  parent.tree.addChild(child);
}

function check(item: Item): CheckProperty {
  return item.properties.property('visibility') as CheckProperty;
}

describe('Item property registry and hierarchical state without network', () => {
  it('honors the configured value and getter callback', () => {
    const item = new Item();
    const plain = new TextProperty('name', item, { value: 'first' });
    expect(plain.getProperty()).toBe('first');
    expect(plain.get()).toBe('first');
    const getter = vi.fn().mockReturnValue('computed');
    const derived = new TextProperty('derived', item, { getProperty: getter });
    expect(derived.get()).toBe('computed');
    expect(getter).toHaveBeenCalledWith(item);
    expect(plain.getContainer()).toBeUndefined();
    expect(plain.isBlocked()).toBe(false);
  });

  it('notifies the change listener and forwards the options to onSet', () => {
    const item = new Item();
    const onSet = vi.fn();
    const property = new TextProperty('name', item, { value: 'old', onSet });
    const onChange = vi.fn();
    property.emitter.on('change', onChange);
    const options = { silent: true };
    property.set('new', options);
    expect(property.getValue()).toBe('new');
    expect(onSet).toHaveBeenCalledWith('new', options, item);
    expect(onChange).toHaveBeenCalledWith({ value: 'new', options });
    property.set(undefined);
    expect(onChange).toHaveBeenLastCalledWith({
      value: 'old',
      options: undefined,
    });
  });

  it('emits change-tree on each ancestor with the original item', () => {
    const parent = node(true);
    const child = node(true);
    const grandchild = node(true);
    connect(parent, child);
    connect(child, grandchild);
    const parentListener = vi.fn();
    const childListener = vi.fn();
    check(parent).emitter.on('change-tree', parentListener);
    check(child).emitter.on('change-tree', childListener);
    check(grandchild).set(false);
    expect(parentListener).toHaveBeenCalledWith({
      value: false,
      options: undefined,
      item: grandchild,
    });
    expect(childListener).toHaveBeenCalledOnce();
    expect(check(grandchild).getParents()).toEqual([child, parent]);
    expect(check(grandchild).getParent()).toBe(child);
  });

  it('removes mounted property containers and detaches listeners on destruction', () => {
    const item = new Item();
    const property = new TextProperty('name', item, {});
    const element = document.createElement('div');
    document.body.appendChild(element);
    property.attach(element);
    const detach = vi.fn();
    Object.assign(property, { _removeEventsListener: detach });
    property.destroy();
    expect(element.isConnected).toBe(false);
    expect(detach).toHaveBeenCalledOnce();
    property.destroy();
  });

  it('registers typed and explicit handlers and deduplicates unchanged sets', () => {
    const item = node(true);
    item.properties.add({ name: 'title', handler: TextProperty });
    const title = item.properties.property('title');
    const onChange = vi.fn();
    title.emitter.on('change', onChange);
    expect(item.properties.list().map((property) => property.name)).toEqual([
      'visibility',
      'title',
    ]);
    item.properties.set('title', 'survey');
    item.properties.set('title', 'survey');
    expect(item.properties.get('title')).toBe('survey');
    expect(onChange).toHaveBeenCalledOnce();
    expect(item.properties.get('missing')).toBeUndefined();
    item.properties.set('missing', 'ignored');
    item.properties.add({ name: 'unsupported', type: 'string' });
    expect(item.properties.property('unsupported')).toBeUndefined();
    item.properties.update();
    item.properties.destroy();
    expect(item.properties.list()).toEqual([]);
    expect(item.properties.property('title')).toBeUndefined();
  });

  it('provides tree navigation without leaking a mutable children array', () => {
    const root = node(true);
    const child = node(true);
    const leaf = node(false);
    connect(root, child);
    connect(child, leaf);
    expect(leaf.tree.getRoot()).toBe(root);
    expect(root.tree.getRoot()).toBeUndefined();
    expect(root.tree.getDescendants()).toEqual([child, leaf]);
    expect(root.tree.find((item) => item === leaf)).toBe(leaf);
    expect(root.tree.some((item) => item === leaf)).toBe(true);
    expect(root.tree.every((item) => item !== root)).toBe(true);
    root.tree.getChildren().length = 0;
    expect(root.tree.getChildren()).toEqual([child]);
  });

  it('recalculates inherited blocking when the cached status is invalidated', () => {
    const parent = node(false);
    const child = node(true);
    connect(parent, child);
    Object.assign(check(child), { _blocked: undefined });
    expect(check(child).isBlocked()).toBe(true);
    expect(check(child).isBlocked()).toBe(true);
  });

  it('blocks and unblocks every descendant when the parent check changes', () => {
    const root = node(true);
    const middle = node(true);
    const leaf = node(true);
    connect(root, middle);
    connect(middle, leaf);
    expect(check(root).isGroup()).toBe(2);
    check(root).set(false);
    expect(check(middle).isBlocked()).toBe(true);
    expect(check(leaf).isBlocked()).toBe(true);
    expect(check(leaf).get()).toBe(true);
    expect(check(leaf).getHierarchyValue()).toBe(false);
    check(root).set(true);
    expect(check(middle).isBlocked()).toBe(false);
    expect(check(leaf).isBlocked()).toBe(false);
    expect(check(leaf).getHierarchyValue()).toBe(true);
  });

  it('bubbles a checked child to an unchecked ancestor', () => {
    const root = node(false);
    const child = node(false);
    connect(root, child);
    check(root).blockChild();
    expect(check(child).isBlocked()).toBe(true);
    check(child).set(true, { bubble: true });
    expect(check(root).get()).toBe(true);
    expect(check(child).get()).toBe(true);
    expect(check(child).isBlocked()).toBe(false);
  });

  it('propagates value changes recursively through child check properties', () => {
    const root = node(true);
    const middle = node(true);
    const leaf = node(true);
    connect(root, middle);
    connect(middle, leaf);
    check(root).set(false, { propagation: true });
    expect([root, middle, leaf].map((item) => check(item).get())).toEqual([
      false,
      false,
      false,
    ]);
    check(root).set(true, { propagation: true });
    expect([root, middle, leaf].map((item) => check(item).get())).toEqual([
      true,
      true,
      true,
    ]);
    expect(check(leaf).getHierarchyValue()).toBe(true);
  });

  it('honors hierarchy=false and calls custom turn-on and turn-off hooks', () => {
    const item = new Item();
    const on = vi.fn();
    const off = vi.fn();
    const set = vi.fn();
    const checkProp = new CheckProperty('enabled', item, {
      value: false,
      hierarchy: false,
      turnOn: on,
      turnOff: off,
      onSet: set,
    });
    off.mockClear();
    set.mockClear();
    checkProp.set(true);
    checkProp.set(false);
    expect(on).toHaveBeenCalledOnce();
    expect(off).toHaveBeenCalledOnce();
    expect(set).toHaveBeenNthCalledWith(1, true, undefined, item);
    expect(set).toHaveBeenNthCalledWith(2, false, undefined, item);
    expect(checkProp.getHierarchyValue()).toBe(false);
  });
});
