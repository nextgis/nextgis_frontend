export function arrayCompare(array1: any[], array2: any[]) {
  return (
    array1.length === array2.length &&
    array1.sort().every(function(value, index) {
      return value === array2.sort()[index];
    })
  );
}
