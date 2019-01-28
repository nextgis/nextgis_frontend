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

  getParents(filterFunc?: (item: Item) => boolean): Item[] {
    const parent = this.getParent();
    if (parent) {
      return filterIn(parent, filterFunc, (x: Item) => x.tree.getParent());
    }
    return [];
  }
  // endregion

  // region Child
  find(filterFunc?: (item: Item) => boolean) {
    return filterIn(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    })[0];
  }

  // getDescendants shortcut
  all(filterFunc?: (item: Item) => boolean): any[] {
    return this.getDescendants(filterFunc);
  }

  getDescendants(filterFunc?: (item: Item) => boolean): any[] {
    return filterIn(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren(): Item[] {
    return this._children;
  }
}
