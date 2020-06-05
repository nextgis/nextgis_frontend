export function capitalize(str: string): string {
  str = String(str).toLowerCase();
  return str[0].toUpperCase() + str.slice(1);
}
