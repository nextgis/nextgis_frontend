# Properties Filter

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

        [['id', 'in', [1,2,3]], ['id', 'notin', [1,2,3]]]

    `like` and `ilike`:

        Place `%`-character after or before `key` string to determine the direction of search.

        - ['str%', 'like', 'hello']
        - ['%str%', 'ilike', 'Worl']

Nesting

`[ [E1], ['any', [E2], [E3, E4] ], ['any', [E5], [E6] ] ] ]`




```js
import { propertiesFilter, featureFilter } from '@nextgis/properties-filter';

const properties = {
    place: 'Tofalaria',
    area: 21
};

propertiesFilter(properties, [['name', 'eq', 'Tofalaria']]);
propertiesFilter(properties, [['name', 'in', ['Tofalaria', 'Siberia']]]);
propertiesFilter(properties, [['name%', 'like', 'Tof']]);

propertiesFilter(properties, [['name', 'eq', 'Tofalaria'], ['area', 'ge', 21]]);
propertiesFilter(properties, ['any', ['name', 'eq', 'Siberia'], ['area', 'gt', 10]]);
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/control-container`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
