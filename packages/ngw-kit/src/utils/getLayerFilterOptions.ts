import type { FilterOptions, GeoJsonAdapterOptions } from '@nextgis/webmap';

const filterOptionsKeys: (keyof FilterOptions)[] = [
  'fields',
  'intersects',
  'limit',
  'orderBy',
  'strategy',
];

export function getLayerFilterOptions(
  options: GeoJsonAdapterOptions,
): FilterOptions {
  const filterOptions: Record<string, any> = {};
  filterOptionsKeys.forEach((x) => {
    const opt = options[x];
    if (opt !== undefined) {
      filterOptions[x] = opt;
    }
  });
  return filterOptions as FilterOptions;
}
