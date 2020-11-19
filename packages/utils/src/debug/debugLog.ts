export function debugLog(message?: string): boolean {
  if (__DEV__) {
    console.warn('DEBUG: ' + message);
    return true;
  }
  return false;
}
