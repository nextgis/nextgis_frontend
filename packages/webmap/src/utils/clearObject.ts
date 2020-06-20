export function clearObject(obj: Record<any, any>): void {
  for (const member in obj) {
    delete obj[member];
  }
}
