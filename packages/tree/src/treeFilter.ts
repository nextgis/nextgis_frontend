import { propertiesFilter, PropertyFilter } from '@nextgis/properties-filter';
export type SelfFilter<X extends any> = (x: X) => boolean;
export type RelationFunction<X extends any> = (x: X) => X | X[] | undefined;

type DefaultTreeItem = Record<string, unknown>;

type TreeFunction<X extends DefaultTreeItem> = (
  item: X | X[],
  filter: SelfFilter<X>,
  relation: RelationFunction<X>
) => X | X[] | boolean | undefined;

export function treeEvery<F extends DefaultTreeItem = DefaultTreeItem>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F>,
  relation: RelationFunction<F> | string
): boolean {
  return !!treeWrapper<F>(item, filter, relation, treeEvery_);
}

export function treeSome<F extends DefaultTreeItem = DefaultTreeItem>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F>,
  relation: RelationFunction<F> | string
): boolean {
  return !!treeWrapper<F>(item, filter, relation, treeFind_);
}

export function treeFind<F extends DefaultTreeItem = DefaultTreeItem>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F>,
  relation: RelationFunction<F> | string
): F | undefined {
  return treeWrapper<F>(item, filter, relation, treeFind_) as F;
}

export function treeFilter<F extends DefaultTreeItem = DefaultTreeItem>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F>,
  relation: RelationFunction<F> | string
): F[] {
  return treeWrapper<F>(item, filter, relation, treeFilter_) as F[];
}

function treeWrapper<F extends DefaultTreeItem = DefaultTreeItem>(
  item: F | F[],
  filter: PropertyFilter | SelfFilter<F> = (x: F) => !!x,
  relation: RelationFunction<F> | string = 'children',
  treeFunction: TreeFunction<F>
): F[] | F | boolean | undefined {
  const filterFunction: SelfFilter<F> =
    typeof filter === 'function'
      ? filter
      : (i: F) => propertiesFilter(i, filter);

  const relationFunction: RelationFunction<F> =
    typeof relation === 'function' ? relation : (i) => i[relation] as F[];

  return treeFunction(item, filterFunction, relationFunction);
}

function treeFind_<F extends any = any>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F) => !!x,
  relationFunc: RelationFunction<F>,
  _filtered: F[] = []
): F | undefined {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (filter) {
      return item;
    }
    const relChild = relationFunc(item);
    if (relChild) {
      if (Array.isArray(relChild)) {
        children = relChild;
      } else {
        children.push(relChild);
      }
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      const result = treeFilter_(
        children[fry],
        filterFunc,
        relationFunc,
        _filtered
      );
      if (result) {
        return children[fry];
      }
    }
  }
}

function treeFilter_<F extends any = any>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F) => !!x,
  relationFunc: RelationFunction<F>,
  _filtered: F[] = []
): F[] {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (filter) {
      _filtered.push(item);
    }
    const relChild = relationFunc(item);
    if (relChild) {
      if (Array.isArray(relChild)) {
        children = relChild;
      } else {
        children.push(relChild);
      }
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      treeFilter_(children[fry], filterFunc, relationFunc, _filtered);
    }
  }

  return _filtered;
}


function treeEvery_<F extends any = any>(
  item: F | F[],
  filterFunc: SelfFilter<F> = (x: F) => !!x,
  relationFunc: RelationFunction<F>,
  _filtered: F[] = []
): boolean {
  let children: F[] = [];
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (!filter) {
      return false;
    }
    const relChild = relationFunc(item);
    if (relChild) {
      if (Array.isArray(relChild)) {
        children = relChild;
      } else {
        children.push(relChild);
      }
    }
  }

  for (let fry = 0; fry < children.length; fry++) {
    if (children[fry]) {
      const res = treeFilter_(children[fry], filterFunc, relationFunc, _filtered);
      if (!res) {
        return false;
      }
    }
  }

  return true;
}
