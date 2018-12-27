export function filterIn(node: any, filterFunc = (x: any) => x, relationFunc, _filtered = []) {
  let children: Node[];
  if (Array.isArray(node)) {
    children = node;
  } else {
    const filter = filterFunc(node);
    if (filter) {
      _filtered.push(node);
    }
    const relChild = relationFunc(node);
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
