import { Item } from './Item';
import { filterIn } from './TreeUtil';

export class TreeHelper {

  item: Item;

  private _parent?: Item;
  private _children?: Item[] = [];

  constructor(item: Item) {
    this.item = item;
  }

  // region Parents
  setParent(parent: Item) {
    this._parent = parent;
  }

  addChildren(children: Item) {
    this._children.push(children);
  }

  getParent(): Item {
    return this._parent;
  }

  getParents(filterFunc?: (item: Item) => boolean): Item[] {
    if (this.getParent()) {
      const generator = filterIn(this._parent, filterFunc, (x: Item) => x.tree.getParent());
      return generator;
    }
    return [];
  }
  // endregion

  // region Child
  getDescendants(filterFunc?: (item: Item) => boolean): any[] {
    return filterIn(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren(): Item[] {
    return this._children;
  }
}
