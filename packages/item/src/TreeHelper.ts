import { treeEvery, treeFilter, treeFind, treeSome } from '@nextgis/tree';

import type { ItemOptions } from './interfaces';
import type { Item as BaseItem } from './Item';

export class TreeHelper<Item extends BaseItem = BaseItem> {
  item: Item;

  private _children: Item[] = [];
  private _parent?: Item;

  constructor(item: Item) {
    this.item = item;
  }

  setParent(parent: Item): void {
    this._parent = parent;
  }

  addChild(child: Item): void {
    this._children.push(child);
  }

  getParent(): Item | undefined {
    return this._parent;
  }

  getParents<I extends Item = Item>(filterFunc?: (item: I) => boolean): I[] {
    const parent = this.getParent() as I;
    if (parent) {
      return treeFilter<I>(
        parent,
        filterFunc,
        (x: I) => x.tree.getParent() as I,
      );
    }
    return [];
  }

  getRoot<I extends Item = Item>(): I | undefined {
    let parent = this.getParent() as I;
    let toReturn = parent;
    while (parent) {
      parent = parent.tree.getParent() as I;
      if (parent) {
        toReturn = parent;
      }
    }
    return toReturn;
  }

  find(
    filterFunc?: (item: Item) => boolean,
  ): BaseItem<ItemOptions> | undefined {
    return treeFind(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  every<I extends Item = Item>(filterFunc?: (item: I) => boolean): boolean {
    return treeEvery(this._children as I[], filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  some<I extends Item = Item>(filterFunc?: (item: I) => boolean): boolean {
    return treeSome(this._children as I[], filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  // getDescendants shortcut
  all(filterFunc?: (item: Item) => boolean): Item[] {
    return this.getDescendants(filterFunc);
  }

  getDescendants(filterFunc?: (item: Item) => boolean): Item[] {
    return treeFilter(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren<T extends Item = Item>(): T[] {
    return [...this._children] as T[];
  }
}
