import { describe, expect, it } from 'vitest';

import { Tree } from '../../packages/tree/src/Tree';
import {
  getChildren,
  treeEvery,
  treeFilter,
  treeFind,
  treeSome,
} from '../../packages/tree/src/treeFilter';

const items = {
  name: 'root',
  enabled: true,
  children: [
    {
      name: 'branch',
      enabled: true,
      children: [{ name: 'leaf', enabled: false, children: [] }],
    },
    { name: 'other', enabled: true, children: [] },
  ],
};

describe('Tree', () => {
  it('builds parent and child relationships recursively', () => {
    const tree = new Tree(items);
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0].item.name).toBe('branch');
    expect(tree.children[0].children[0].item.name).toBe('leaf');
    expect(tree.children[0].children[0].getParents().map((x) => x.item.name)).toEqual([
      'leaf', 'branch', 'root',
    ]);
  });

  it('adds child nodes with the same relation', () => {
    const tree = new Tree({ nodes: [] }, { relation: 'nodes' });
    tree.addChild({ name: 'child', nodes: [{ name: 'grandchild', nodes: [] }] });
    expect(tree.children[0].relation).toBe('nodes');
    expect(tree.children[0].children[0].item.name).toBe('grandchild');
  });

  it('finds the first matching item in depth-first order', () => {
    const tree = new Tree(items);
    expect(tree.find((item) => item.name === 'leaf').item.name).toBe('leaf');
    expect(tree.find((item) => item.name === 'missing')).toBeUndefined();
  });

  it('filters all matching nodes, including nested nodes', () => {
    const tree = new Tree(items);
    expect(tree.filter((item) => item.enabled).map((x) => x.item.name)).toEqual([
      'root', 'branch', 'other',
    ]);
  });

  it('checks some and every across the entire tree', () => {
    const tree = new Tree(items);
    expect(tree.some((item) => !item.enabled)).toBe(true);
    expect(tree.some((item) => item.name === 'missing')).toBe(false);
    expect(tree.every((item) => item.enabled)).toBe(false);
    expect(tree.every((item) => typeof item.name === 'string')).toBe(true);
  });

  it('returns the root when the root matches', () => {
    const tree = new Tree(items);
    expect(tree.find((item) => item.name === 'root')).toBe(tree);
  });

  it('uses a custom function to locate children', () => {
    const tree = new Tree(
      { value: 1, descendants: [{ value: 2, descendants: [] }] },
      { relation: (item) => item.descendants },
    );
    expect(tree.filter((item) => item.value > 0)).toHaveLength(2);
  });
});

describe('treeFilter helpers', () => {
  it('returns undefined for missing children', () => {
    expect(getChildren({ name: 'leaf' })).toBeUndefined();
  });

  it('accepts a single child from a relation function', () => {
    const parent = { child: { name: 'leaf' } };
    expect(getChildren<{ name?: string; child?: { name: string } }>(parent, (item) => item.child)).toEqual([parent.child]);
  });

  it('finds the first match in an array of roots', () => {
    expect(treeFind([{ name: 'first' }, { name: 'second' }], (x) => x.name === 'second')).toEqual({
      name: 'second',
    });
  });

  it('filters across an array of roots', () => {
    expect(treeFilter([{ name: 'one' }, { name: 'two' }], (x) => x.name !== 'two')).toEqual([
      { name: 'one' },
    ]);
  });

  it('handles empty arrays and failing predicates', () => {
    expect(treeEvery([], () => false)).toBe(true);
    expect(treeSome([], () => true)).toBe(false);
    expect(treeEvery(items, (x) => x.enabled)).toBe(false);
    expect(treeSome(items, (x) => x.name === 'leaf')).toBe(true);
  });
});
