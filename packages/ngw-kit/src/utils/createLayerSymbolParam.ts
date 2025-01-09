export function createLayerSymbolParam(
  resourceId: number,
  intervals: (string | number)[],
) {
  return { [`symbols[${resourceId}]`]: intervals.join(',') || undefined };
}
