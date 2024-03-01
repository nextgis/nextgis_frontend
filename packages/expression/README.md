# Expression

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/expression) ![version](https://img.shields.io/npm/v/@nextgis/expression)

@nextgis/expression is a versatile library designed for executing actions on objects based on expressions inspired by the syntax of [Mapbox Style expressions](https://docs.mapbox.com/style-spec/reference/expressions/). These expressions are JSON-serializable, making them perfect for configurations, data processing, or any other kind of object manipulation.

## Features

- JSON-serializable Expressions: Represent complex logic and operations in a portable and easily shareable format.
- Zero Dependencies: Built to be completely standalone without relying on external packages.
- Versatility: Ability to perform various operations on objects directly in JavaScript, from simple retrieval to complex computations.
- Easy Integration: Designed with a simple API for hassle-free integration into any project.

## Installation

```bash
# latest stable
$ npm install --save-dev @nextgis/expression
# or
$ yarn add @nextgis/expression
```

## Usage

Expressions are like little command lists inside arrays. The first item in this list tells you what action to do, like "add" or "multiply". The items after that are the things you're acting on.

For example, to multiply 5 by 3:

```javascript
const myExpression = ["*", 5, 3];
```

To find out what this equals, use the evaluate function:

```javascript
import { evaluate } from '@nextgis/expression';

const answer = evaluate(["*", 5, 3]);
console.log(answer); // This will show: 15
```

You can even put expressions inside other expressions:

```javascript
const biggerExpression = ["+", ["*", 5, 3], 4]; // This is like saying (5 times 3) plus 4
const biggerAnswer = evaluate(biggerExpression);
console.log(biggerAnswer); // This will show: 19
```

When we need to retrieve data stored in an object, the second argument in evaluate becomes invaluable.

Imagine you have some data:

```javascript
const lakeData = {
  name: "Baikal",
  depth: 1642, // in meters
  volume: "23,600 km³", // in cubic kilometers
  islands: ["Olkhon", "Big Ushkany", "Small Ushkany"]
};
```

You can use expressions to access or manipulate parts of this data.

To fetch the name of the lake:

```javascript
const nameExpression = ["get", "name"];
```

Execute this with evaluate, passing in both the expression and the data:

```javascript
const lakeName = evaluate(["get", "name"], lakeData);
console.log(lakeName); // Outputs: "Baikal"
```

Want the first island from the "islands" array? Do this:

```javascript
const islandExpression = ["at", 0, ["get", "islands"]];
const firstIsland = evaluate(islandExpression, lakeData);
console.log(firstIsland); // Outputs: "Olkhon"
```

To visually represent data, sometimes we might want to assign colors based on numerical values. For instance, we can use interpolation to determine a color for Lake Baikal based on its depth.

Let's decide on a simple color gradient:

Up to 500 meters: Light Blue (#ADD8E6)
At 1642 meters (Baikal's maximum depth): Deep Blue (#00008B)

```javascript
const colorExpression = [
  "interpolate", ["linear"], ["get", "depth"],
  500, "#ADD8E6", // Light Blue up to 500 meters
  1642, "#00008B" // Deep Blue at Baikal's max depth
];

const derivedColor = evaluate(colorExpression, lakeData);
console.log(derivedColor); // Assuming the depth of `lakeData` is at its max, outputs: "#00008B", which corresponds to the Deep Blue color
```

Let's move on to exploring all possible expression types and examples of their use.

### Types Expressions

Expressions under the "Types" category are designed to work with and convert data types. Here are some of the available types expressions:

#### 'literal'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#literal)

The literal expression provides a way to explicitly label a value as a raw constant, ensuring that it's interpreted as a literal instead of an expression. This can be especially useful in scenarios where there might be ambiguity.

```javascript
import { evaluate } from '@nextgis/expression';
// Without 'literal', the array might be interpreted as an expression.
const literalExpression = ['literal', [10, 20, 30]];
console.log(evaluate(literalExpression)); // [10, 20, 30]
```

#### 'array'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#array)

For defining arrays and specifying types within arrays.

Basic Array

```javascript
import { evaluate } from '@nextgis/expression';
const obj = { array: [1,2,3] }
console.log(evaluate(['array', ['get', 'array']], obj)); // [1, 2, 3]
```

Typed Array

```javascript
import { evaluate } from '@nextgis/expression';
console.log(evaluate(['array', 'number', ['get', 'array']])); // [1, 2, 3] as number[]
```

Fixed Length Typed Array

```javascript
import { evaluate } from '@nextgis/expression';
console.log(evaluate(['array', 'string', 2, ["literal", ["Hello", "World"]]])); // ["Hello", "World"] as string[2]
```

#### 'boolean', 'literal', 'number', 'object', 'string'

These are basic type expressions to directly specify a particular type of data.

Example:

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['boolean', true])); // true
console.log(evaluate(['number', 42])); // 42
console.log(evaluate(['object', ['literal', { key: "value" }]], obj)); // { key: "value" }
console.log(evaluate(['string', "Hello World"])); // "Hello World"
```

##### Fallbacks and Errors

If multiple values are provided for type expressions like 'boolean', each one is evaluated in order until a result of the specified type is obtained. If none of the provided values match the specified type, the expression results in an error.

```javascript
// Fallback until a boolean is found
console.log(evaluate(['boolean', "not a boolean", "still not a boolean", true])); // true

// Results in an error since none of the values are booleans
try {
  console.log(evaluate(['boolean', "not a boolean", "still not a boolean", 42]));
} catch (error) {
  console.error(error.message); // Error: received a mismatched type
}
```

#### 'to-boolean', 'to-number', 'to-string'

These expressions allow for type conversions.

```javascript
const obj = {
  value1: "true",
  value2: "hello",  // Not a number
  value3: 100
};

console.log(evaluate(['to-boolean', ["get", "value1"], true], obj)); // true
console.log(evaluate(['to-number', ["get", "value2"], ["get", "value3"]], obj)); // 100 (because "hello" isn't a number, so it takes value3)
console.log(evaluate(['to-string', ["get", "value3"]], obj)); // "100"
```

#### 'typeof'

This expression returns the type of the given value.

```javascript
const obj = {
  value: [1, 2, 3]
};

console.log(evaluate(['typeof', ["get", "value"]], obj)); // "array"
```

### Lookup Expressions

The Lookup category of expressions allows users to access and modify specific parts of the data. This category includes methods to extract a value by its key or index, determine if an object has a certain property, find out the length of a string or array, and many others.

#### 'at'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#at)

Fetches a value from an array using an index.

```javascript
import { evaluate } from '@nextgis/expression';

const obj = {
  values: [10, 20, 30, 40]
};

console.log(evaluate(['at', 2, ['get', 'values']], obj)); // 30
```

#### 'get'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#get)

Retrieves the value of a property from an object.

```javascript
const obj = {
      foo: 'bar',
      key: 'foo',
      nested: { key: 'value' },
    };

// should get value from obj using key
console.log(evaluate(['get', 'foo'], obj)) // bar
console.log(evaluate(['get', 'nested'], obj)) // { key: 'value' }

// should get value from evaluated object using key
console.log(evaluate(['get', 'key', ['get', 'nested']], obj)) // 'value'

// should return null for nonexistent keys
console.log(evaluate(['get', 'nonexistent'], obj)) // null
```

#### 'has'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#has)

```javascript
console.log(evaluate(['has', 'width'], { type: 'River', width: 30 })); // true
console.log(evaluate(['has', 'width', ['literal', { type: 'River', width: 30 }]])); // true
```

#### 'length'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#length)

Returns the length of a string or an array.

```javascript
console.log(evaluate(['length', ['get', 'name']], { name: 'NextGIS' })); // 7
```

#### 'in'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#in)

Checks if an element exists in an array.

```javascript
console.log(evaluate(['in', 'blue', ['get', 'colors']], {
  colors: ['red', 'blue', 'green']
})); // true
```

#### 'index-of'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#index-of)

Returns the index of the first occurrence of a substring or an array element.

```javascript
const obj = {
  colors: ['red', 'blue', 'green']
};

console.log(evaluate(['index-of', 'blue', ['get', 'colors']], obj)); // 1
```

#### 'slice'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#slice)

Returns a subsection of a string or an array.

```javascript
const obj = {
  animals: ['dog', 'cat', 'bird', 'fish']
};

console.log(evaluate(['slice', ['get', 'animals'], 1, 3], obj)); // ['cat', 'bird']
```

### Decision Expressions

The Decision category provides simple tools to make comparisons and decisions based on your data. These expressions help you check equality, make logic-based choices, and more.

#### '!'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#!)

Returns the logical negation of the input.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['!', true])); // false
```

#### '!='

[API](https://docs.mapbox.com/style-spec/reference/expressions/#!=)

Checks if two values are not equal.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['!=', ['get', 'type'], 'River'], { type: 'Stream' })); // true
```

#### '<'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#<)

Checks if the first value is less than the second.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['<', ['get', 'length'], 100], { length: 80 })); // true
```

#### '<='

[API](https://docs.mapbox.com/style-spec/reference/expressions/#<)

Checks if the first value is less than or equal to the second.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['<=', ['get', 'length'], 100], { length: 100 })); // true
```

#### '=='

[API](https://docs.mapbox.com/style-spec/reference/expressions/#==)

Checks if two values are equal.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['==', ['get', 'type'], 'River'], { type: 'River' })); // true
```

#### '>='

[API](https://docs.mapbox.com/style-spec/reference/expressions/#>=)

Checks if the first value is greater than or equal to the second.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['>=', ['get', 'width'], 50], { width: 60 })); // true
```

#### '>'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#>)

Checks if the first value is greater than the second.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['>', ['get', 'width'], 50], { width: 40 })); // false
```

#### 'all'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#all)

Evaluates multiple conditions and returns true if all of them are true.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate(['all', ['>', ['get', 'width'], 50], ['==', ['get', 'type'], 'River']], { width: 60, type: 'River' })); // true
```

#### 'any'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#any)

Evaluates multiple conditions and returns true if at least one of them is true.

```javascript
import { evaluate } from '@nextgis/expression';

console.log(evaluate([
  'any',
  ['>', ['get', 'width'], 100],
  ['==', ['get', 'type'], 'Stream']
], { width: 80, type: 'Stream' })); // true
```

#### 'case'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#case)

Evaluates each pair of conditions and values sequentially and returns the output of the first true condition. If none are true, it returns the value of the optional default case.

```javascript
import { evaluate } from '@nextgis/expression';

const obj = {
  two: 2,
  str: 'Foo Bar',
};

evaluate([
    'case',
    ['==', ['get', 'two'], 2],
    'matches two',
    ['==', ['get', 'str'], 'Not Foo Bar'],
    'matches string',
    'fallback',
  ],
  obj,
) // 'matches two'
```

#### 'match'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#match)

Matches an input with a series of cases, returning the output associated with the first matching case. If there's no match, a default value is returned.

```javascript
import { evaluate } from '@nextgis/expression';

const obj = { shape: 'circle' };
console.log(evaluate([
  'match',
  ['get', 'shape'],
  'square', 'It is a square',
  'circle', 'It is a circle',
  'Unknown shape'],
obj)); // 'It is a circle'
```

### Interpolation Expressions

Interpolation expressions allow you to create smooth transitions between values based on your input data. They can be especially useful when visualizing data gradients or when you want to transition between two values.

#### 'step'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#step)

The step expression creates a stepped, piecewise-constant function. It's mainly used when you want to categorize your data into specific bins.

```javascript
import { evaluate } from '@nextgis/expression';

const prop = { five: 5, one: 1 };

console.log(evaluate(['step', ['get', 'five'], 0, 4, 'low', 6, 'medium', 8, 'high'], prop)); // 'low'
console.log(evaluate(['step', 6, 0, 4, 'low', 6, 'medium', 8, 'high'], prop)); // 'medium'
console.log(evaluate(['step', 9, 0, 4, 'low', 6, 'medium', 8, 'high'], prop)); // 'high'
console.log(evaluate(['step', ['get', 'one'], 'low', 6, 'medium', 8, 'high'], prop)); // 'low'
```

#### 'interpolate'

[API](https://docs.mapbox.com/style-spec/reference/expressions/#interpolate)

The interpolate expression provides smooth transitions between pairs of input and output values.

Currently, only linear interpolation is supported.

```javascript
import { evaluate } from '@nextgis/expression';

const prop = { value: 5 };

// Interpolating numbers:
console.log(evaluate([
  'interpolate',
  ['linear'],
  ['get', 'value'],
  0, 10,
  10, 20
], prop)); // 15

// Interpolating HEX colors:
console.log(evaluate([
  'interpolate',
  ['linear'],
  ['get', 'value'],
  0, '#000000',
  10, '#ffffff'
], prop
)); // 'rgb(128,128,128)'

// Interpolating Named colors:
console.log(evaluate([
  'interpolate',
  ['linear'],
  ['get', 'value'],
  0, 'black',
  10, 'white'
], prop
)); // 'rgb(128,128,128)'

// Interpolating RGB colors:
console.log(evaluate([
  'interpolate',
  ['linear'],
  ['get', 'value'],
  0, 'rgb(0,0,0)',
  10, 'rgb(255,255,255)'
], prop)); // 'rgb(128,128,128)'

// Interpolating with multiple stops
console.log(evaluate([
  'interpolate',
  ['linear'],
  14,
  0, 10,
  5, 20,
  10, 30,
  15, 40
])); // 38
```

### Math Expressions

[API](https://docs.mapbox.com/style-spec/reference/expressions/#math)

The Math category includes a comprehensive set of mathematical operations to perform arithmetic, trigonometric, logarithmic, and other related calculations.

Supported Operations:

- Arithmetic: +, -, *, /, %, ^, abs, ceil, floor, round, max, min, sqrt
- Trigonometric: acos, asin, atan, cos, sin, tan
- Logarithmic and Exponential: ln, ln2, log10, log2, e

```javascript
import { evaluate } from '@nextgis/expression';

// Summation (multiple arguments):
evaluate(['+', 1, 2, 3, 4]); // Outputs: 10

// Subtraction (two arguments):
evaluate(['+', 1, 2, 3, 4]); // Outputs: 10

// Sine function (single argument):
evaluate(['sin', ['/', 'pi', 2]]); // Outputs: 1
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/expression`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
