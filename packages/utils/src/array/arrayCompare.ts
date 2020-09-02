/**
 * Comparison of the contents of two arrays. Position of elements is ignored.
 * @example
 * ```javascript
 * arrayCompare(['a', 'b'], ['b', 'a']) // true
 * arrayCompare(['a', 'b'], ['b']) // false
 * arrayCompare('asdf1234', '1234asdf') // true
 * ```
 */
export function arrayCompare(array1: any[], array2: any[]): boolean {
  array1 = Array.from(array1).sort();
  array2 = Array.from(array2).sort();
  return _arrayCompare(array1, array2);
}

/**
 * Comparing content and position of elements of two arrays.
 * @example
 * ```javascript
 * arrayCompareStrict(['a', 'b'], ['a', 'b']) // true
 * arrayCompareStrict(['a', 'b'], ['b', 'a']) // false
 * arrayCompareStrict('asdf1234', 'asdf1234') // true
 * arrayCompareStrict('asdf1234', '1234asdf') // false
 * ```
 */
export function arrayCompareStrict(array1: any[], array2: any[]): boolean {
  array1 = Array.from(array1);
  array2 = Array.from(array2);
  return _arrayCompare(array1, array2);
}

function _arrayCompare(array1: any[], array2: any[]): boolean {
  return (
    array1.length === array2.length &&
    array1.every(function (value, index) {
      return value === array2[index];
    })
  );
}
