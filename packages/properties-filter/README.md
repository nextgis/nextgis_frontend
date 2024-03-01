# Properties Filter

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/properties-filter) ![version](https://img.shields.io/npm/v/@nextgis/properties-filter)

An auxiliary library that allows filtering objects by its properties using JSON-serializable expressions

## Installation

```bash
# latest stable
$ npm install --save-dev @nextgis/properties-filter
# or
$ yarn add @nextgis/properties-filter
```

## Usage

General view of expression

`[ С , [E1] , [E2] , [EN] ]`

- С - condition (optional). May be 'all' or 'any';

- E - expression:

  `[key, operator, value]`

  - key - property name;
  - operator - `gt`, `lt`, `ge`, `le`, `eq`, `ne`, `in`, `notin`, `like`, `ilike`;
  - value - anything to compare with property by operator

  `in` and `notin`:

  - [['id', 'in', [1,2,3]], ['id', 'notin', [1,2,3]]]

  `like` and `ilike`:

  Place `%`-character after or before `key` string to determine the direction of search.

  - ['str%', 'like', 'hello']
  - ['%str%', 'ilike', 'Worl']

Nesting

`[ [E1], ['any', [E2], [E3, E4] ], ['any', [E5], [E6] ] ] ]`

Example

```javascript
import { propertiesFilter, featureFilter } from '@nextgis/properties-filter';

const properties = {
  place: 'Tofalaria',
  area: 21,
};

propertiesFilter(properties, [['place', 'eq', 'Tofalaria']]); // true
propertiesFilter(properties, [['place', 'in', ['Tofalaria', 'Siberia']]]); // true
propertiesFilter(properties, [['place%', 'like', 'Tof']]); // true

propertiesFilter(properties, [
  // 'and', // - by default
  ['place', 'eq', 'Tofalaria'],
  ['area', 'ge', 21],
]); // true
propertiesFilter(properties, [
  'any',
  ['place', 'eq', 'Siberia'],
  ['area', 'gt', 10],
]); // true
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/properties-filter`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
