import { Node } from './Node';
import { filterIn } from './TreeUtil';

export class TreeHelper {

  node: Node;

  private _parent?: Node;
  private _children?: Node[] = [];

  constructor(node: Node) {
    this.node = node;
  }

  // region Parents
  setParent(parent: Node) {
    this._parent = parent;
  }

  addChildren(children: Node) {
    this._children.push(children);
  }

  getParent(): Node {
    return this._parent;
  }

  getParents(filterFunc?: (node: Node) => boolean): Node[] {
    if (this.getParent()) {
      const generator = filterIn(this._parent, filterFunc, (x: Node) => x.tree.getParent());
      return generator;
    }
    return [];
  }
  // endregion

  // region Child
  getDescendants(filterFunc?: (node: Node) => boolean): any[] {
    return filterIn(this._children, filterFunc, (x) => {
      return x.tree.getChildren();
    });
  }

  getChildren(): Node[] {
    return this._children;
  }
}
