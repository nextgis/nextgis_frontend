# Expression

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/expression) ![version](https://img.shields.io/npm/v/@nextgis/expression)

`@nextgis/expression` is a versatile library designed for filtering objects based on expressions inspired by the syntax of [Mapbox Style expressions](https://docs.mapbox.com/style-spec/reference/expressions/). Regardless of whether you're working with GIS, data, or any other kind of object, this library enables you to easily determine if an object meets the conditions set by the expression.

## Features

- Zero Dependencies: Built to be completely standalone without relying on external packages.
- Versatility: Capability to filter any objects directly in JavaScript.
- Easy Integration: Designed with a simple API for hassle-free integration into any project.

## Installation

```bash
# latest stable
$ npm install --save-dev @nextgis/expression
# or
$ yarn add @nextgis/expression
```

## Usage

```javascript
import { evaluate } from '@nextgis/expression';

const filterExpression = [
  "all",
  ["==", ["get", "type"], "river"],
  [">", ["get", "width"], 30]
];

const obj = {
  type: "river",
  width: 35
};

const result = evaluate(filterExpression, obj);

console.log(result); // true
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/expression`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
