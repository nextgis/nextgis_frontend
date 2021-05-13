export function debugLog(message?: string): boolean {
  // @ts-ignore
  if (__DEV__) {
    console.trace('DEBUG: ' + message);
    return true;
  }
  return false;
}
