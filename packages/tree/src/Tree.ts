import {
  getChildren,
  treeEvery,
  treeFilter,
  treeFind,
  treeSome,
} from './treeFilter';

import type { PropertyFilter } from '@nextgis/properties-filter';
import type {
  DefaultTreeItem,
  SelfFilter,
  TreeOptions,
  TreeRelation,
} from './interfaces';

export class Tree<TREE_ITEM = any> {
  relation: TreeRelation = 'children';
  children: Tree<TREE_ITEM>[] = [];

  protected _parent?: Tree<TREE_ITEM>;

  constructor(
    public item: DefaultTreeItem = { children: [] },
    options: TreeOptions<any> = {},
  ) {
    if (options.relation) {
      this.relation = options.relation;
    }
    const children = getChildren(item, options.relation);
    if (children && children.length) {
      children.forEach((x) => {
        this.addChild(x);
      });
    }
  }

  addChild(treeItem: TREE_ITEM): void {
    const childTreeItem = new Tree(treeItem, { relation: this.relation });
    Object.defineProperty(childTreeItem, '_parent', { value: this });
    this.children.push(childTreeItem);
  }

  getParents(): Tree[] {
    return treeFilter(this, (x) => !!x, '_parent');
  }

  every(filter?: PropertyFilter | SelfFilter): boolean {
    return !!treeEvery(this, filter, this.relation, (t) => t.item);
  }

  some(filter?: PropertyFilter | SelfFilter): boolean {
    return !!treeSome(this, filter, this.relation, (t) => t.item);
  }

  find(filter?: PropertyFilter | SelfFilter<TREE_ITEM>): Tree {
    return treeFind<any>(this, filter, this.relation, (t) => t.item);
  }

  filter(filter?: PropertyFilter | SelfFilter<TREE_ITEM>): Tree[] {
    return treeFilter<any>(this, filter, this.relation, (t) => t.item);
  }
}
