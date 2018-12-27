export function filterIn(item: any, filterFunc = (x: any) => x, relationFunc, _filtered = []) {
  let children;
  if (Array.isArray(item)) {
    children = item;
  } else {
    const filter = filterFunc(item);
    if (filter) {
      _filtered.push(item);
    }
    const relChild = relationFunc(item);
    if (relChild) {
      children = [].concat(relChild);
    }
  }
  if (children) {
    for (let fry = 0; fry < children.length; fry++) {
      if (children[fry]) {
        filterIn(children[fry], filterFunc, relationFunc, _filtered);
      }
    }
  }
  return _filtered;
}
