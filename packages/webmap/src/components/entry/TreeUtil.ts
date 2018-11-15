export function filterIn(entry, filterFunc = (x) => x, relationFunc, _filtered = []) {
  let child;
  if (Array.isArray(entry)) {
    child = entry;
  } else {
    const filter = filterFunc(entry);
    if (filter) {
      _filtered.push(entry);
    }
    const relChild = relationFunc(entry);
    if (relChild) {
      child = [].concat(relChild);
    }
  }
  if (child) {
    for (let fry = 0; fry < child.length; fry++) {
      if (child[fry]) {
        filterIn(child[fry], filterFunc, relationFunc, _filtered);
      }
    }
  }
  return _filtered;
}
