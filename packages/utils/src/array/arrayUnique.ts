export function arrayUnique<T = any>(arr: T[]): T[] {
  return arr.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}
