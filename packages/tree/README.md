# Tree

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/tree) ![version](https://img.shields.io/npm/v/@nextgis/tree)

Utilities to simplify interaction with tree data structures

## Installation

```bash
# latest stable
$ npm install --save-dev @nextgis/tree
# or
$ yarn add @nextgis/tree
```

General form for each tree function

treeFunc(item | item[], actionFunc, relationFunc | childrenParamName)

## Usage

```javascript
import { treeFilter, treeFind, treeSome, treeEvery } from '@nextgis/tree';

const tree = [
  {
    name: 'A',
    children: [{ name: 'A-a' }, { name: 'A-b', children: [{ name: 'A-b-1' }] }],
  },
  {
    name: 'B',
    children: [{ name: 'B-a' }, { name: 'B-b' }],
  },
];

// 'children' - is default relation name, this param may be ignored in this case
treeFilter(tree, (item): item.name !== 'A', 'children').map((item) => item.name); // ['B', 'B-a', 'B-b']

treeFind(tree, (item)=> item.name === 'A-b-1', (item) => item.children); // {name: 'A-b-2'}
treeFind(tree, (item)=> item.name === 'A-b-2'); // undefined

treeSome(tree, someFunction, relationFunction | childrenParamName): boolean;

treeEvery(tree, everyFunction, relationFunction | childrenParamName): boolean;
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/tree`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
