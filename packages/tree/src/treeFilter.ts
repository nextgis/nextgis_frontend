import { propertiesFilter } from '@nextgis/properties-filter';

import type { PropertyFilter } from '@nextgis/properties-filter';

import type {
  DefaultTreeItem,
  RelationFunction,
  SelfFilter,
  TreeRelation,
} from './interfaces';

type D = DefaultTreeItem;

type TreeFunction<X extends D> = (
  item: X | X[],
  filter: SelfFilter<X>,
  relation: TreeRelation<X>,
) => X | X[] | boolean | undefined;

type ItemPrepareFunction<F extends D> = (item: D) => F;

export function treeEvery<F extends D = D>(
  item: F | F[],
  filter?: PropertyFilter | SelfFilter<F>,
  relation?: TreeRelation<F>,
  itemPrepare?: ItemPrepareFunction<F>,
): boolean {
  return !!treeWrapper<F>(item, filter, relation, treeEvery_, itemPrepare);
}

export function treeSome<F extends D = D>(
  item: F | F[],
  filter?: PropertyFilter | SelfFilter<F>,
  relation?: TreeRelation<F>,
  itemPrepare?: ItemPrepareFunction<F>,
): boolean {
  return !!treeWrapper<F>(item, filter, relation, treeFind_, itemPrepare);
}

export function treeFind<F extends D = D>(
  item: F | F[],
  filter?: PropertyFilter | SelfFilter<F>,
  relation?: TreeRelation<F>,
  itemPrepare?: ItemPrepareFunction<F>,
): F | undefined {
  return treeWrapper<F>(item, filter, relation, treeFind_, itemPrepare) as F;
}

export function treeFilter<F extends D = D>(
  item: F | F[],
  filter?: PropertyFilter | SelfFilter<F>,
  relation?: TreeRelation<F>,
  itemPrepare?: ItemPrepareFunction<F>,
): F[] {
  return treeWrapper<F>(
    item,
    filter,
    relation,
    treeFilter_,
    itemPrepare,
  ) as F[];
}

export function getChildren<F extends D = D>(
  item: F,
  relation: TreeRelation<F> = 'children',
): F[] | undefined {
  let children: F[] = [];
  const relationFunction: RelationFunction<F> =
    typeof relation === 'function' ? relation : (i): F[] => i[relation];
  const relChild = relationFunction(item);
  if (relChild) {
    if (Array.isArray(relChild)) {
      children = relChild;
    } else {
      children.push(relChild);
    }
  }
  return relChild ? children : undefined;
}

function treeWrapper<F extends D = D>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F> = (x: F): boolean => !!x,
  relation: TreeRelation<F> = 'children',
  treeFunction: TreeFunction<F>,
  itemPrepare?: ItemPrepareFunction<F>,
): F[] | F | boolean | undefined {
  const filterFunction: SelfFilter<F> =
    typeof filter === 'function'
      ? filter
      : (i: F): boolean => propertiesFilter(i, filter);
  if (itemPrepare) {
    return treeFunction(
      item,
      (i: F): boolean => filterFunction(itemPrepare(i)),
      relation,
    );
  }
  return treeFunction(item, filterFunction, relation);
}

function treeFind_<F extends D = D>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F): boolean => !!x,
  relation: TreeRelation<F>,
  _filtered: F[] = [],
): F | undefined {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (filter) {
      return item;
    }
    const relChildren = getChildren(item, relation);
    if (relChildren) {
      children = relChildren;
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      const result = treeFind_(children[fry], filterFunc, relation, _filtered);
      if (result) {
        return result;
      }
    }
  }
}

function treeFilter_<F extends D = D>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F): boolean => !!x,
  relation: TreeRelation<F>,
  _filtered: F[] = [],
): F[] {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (filter) {
      _filtered.push(item);
    }
    const relChildren = getChildren(item, relation);
    if (relChildren) {
      children = relChildren;
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      treeFilter_(children[fry], filterFunc, relation, _filtered);
    }
  }

  return _filtered;
}

function treeEvery_<F extends D = D>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F): boolean => !!x,
  relation: TreeRelation<F>,
  _filtered: F[] = [],
): boolean {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (!filter) {
      return false;
    }
    const relChildren = getChildren(item, relation);
    if (relChildren) {
      children = relChildren;
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      const res = treeEvery_(children[fry], filterFunc, relation, _filtered);
      if (!res) {
        return false;
      }
    }
  }

  return true;
}
