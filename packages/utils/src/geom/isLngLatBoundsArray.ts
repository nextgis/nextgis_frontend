import { LngLatBoundsArray } from '@nextgis/utils';

export function isLngLatBoundsArray(
  array: unknown,
): array is LngLatBoundsArray {
  return (
    Array.isArray(array) &&
    array.length === 4 &&
    array.every((x) => typeof x === 'number')
  );
}
