import { Tree } from './Tree';
import { treeEvery, treeFilter, treeFind, treeSome } from './treeFilter';

export { Tree, treeEvery, treeFilter, treeFind, treeSome };

// shortcut to use like `Tree.find` from global scope
export {
  treeEvery as every,
  treeFilter as filter,
  treeFind as find,
  treeSome as some,
};
