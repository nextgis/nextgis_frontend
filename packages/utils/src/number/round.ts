export function round(val: number, toFixed?: number): number {
  const n = toFixed ? Number('1e+' + toFixed) : 1;
  return Math.round((val + Number.EPSILON) * n) / n;
}
