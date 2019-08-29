/**
 * @module item
 */
export type SelfFilter<X extends any> = (x: X) => boolean;
export type RelationFunction<X extends any> = (x: X) => X | X[] | undefined;

export function filterIn<F extends any = any>(
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
      filterIn(children[fry], filterFunc, relationFunc, _filtered);
    }
  }

  return _filtered;
}
