import { Entry } from './Entry';
import { filterIn } from './TreeUtil';

export class TreeHelper {

  entry: Entry;

  private _parent?: Entry;
  private _children?: Entry[] = [];

  constructor(entry: Entry) {
    this.entry = entry;
  }

  // region Parents
  setParent(parent: Entry) {
    this._parent = parent;
  }

  addChildren(children: Entry) {
    this._children.push(children);
  }

  getParent(): Entry {
    return this._parent;
  }

  getParents(filterFunc?: (entry: Entry) => boolean): Entry[] {
    if (this.getParent()) {
      const generator = filterIn(this._parent, filterFunc, (x: Entry) => x.tree.getParent());
      return generator;
    }
    return [];
  }
  // endregion

  // region Child
  getDescendants(filterFunc?: (entry: Entry) => boolean): any[] {
    return filterIn(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren(): Entry[] {
    return this._children;
  }
}
