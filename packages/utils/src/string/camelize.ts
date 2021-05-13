export function camelize(str: string): string {
  return str
    .replace(/^[_.\- ]+/, '')
    .toLocaleLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) =>
      p1.toLocaleUpperCase(),
    )
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, (m) => m.toLocaleUpperCase());
}
