export function debugLog(message?: string): boolean {
  if (__DEV__) {
    console.trace('DEBUG: ' + message);
    return true;
  }
  return false;
}
