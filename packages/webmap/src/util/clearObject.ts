export function clearObject(obj: Record<any, any>) {
  for (const member in obj) {
    if (obj.hasOwnProperty(member)) {
      delete obj[member];
    }
  }
}
