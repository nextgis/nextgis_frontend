import { treeFind, treeFilter, treeEvery, treeSome } from '@nextgis/tree';
import { Item } from './Item';
import { ItemOptions } from './interfaces';

export class TreeHelper {
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
        (x: I) => x.tree.getParent() as I
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
  // endregion

  find(filterFunc?: (item: Item) => boolean): Item<ItemOptions> | undefined {
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
  all(filterFunc?: (item: Item) => boolean): any[] {
    return this.getDescendants(filterFunc);
  }

  getDescendants(filterFunc?: (item: Item) => boolean): any[] {
    return treeFilter(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren<T extends Item = Item>(): T[] {
    return this._children as T[];
  }
}
