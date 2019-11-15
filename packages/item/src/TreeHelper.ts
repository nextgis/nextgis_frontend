/**
 * @module item
 */

import { Item } from './Item';
import { filterIn } from './TreeUtil';

export class TreeHelper {
  item: Item;

  private _children: Item[] = [];
  private _parent?: Item;

  constructor(item: Item) {
    this.item = item;
  }

  // region Parents
  setParent(parent: Item) {
    this._parent = parent;
  }

  addChild(child: Item) {
    this._children.push(child);
  }

  getParent(): Item | undefined {
    return this._parent;
  }

  getParents<I extends Item = Item>(filterFunc?: (item: I) => boolean): I[] {
    const parent = this.getParent() as I;
    if (parent) {
      return filterIn(parent, filterFunc, (x: I) => x.tree.getParent() as I);
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

  // region Child
  find(filterFunc?: (item: Item) => boolean) {
    return filterIn(this._children, filterFunc, x => {
      return x.tree.getChildren();
    })[0];
  }

  // getDescendants shortcut
  all(filterFunc?: (item: Item) => boolean): any[] {
    return this.getDescendants(filterFunc);
  }

  getDescendants(filterFunc?: (item: Item) => boolean): any[] {
    return filterIn(this._children, filterFunc, x => {
      return x.tree.getChildren();
    });
  }

  getChildren<T extends Item = Item>(): T[] {
    return this._children as T[];
  }
}
