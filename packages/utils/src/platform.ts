export const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const type: 'browser' | 'node' = isBrowser ? 'browser' : 'node';

export function getGlobalVariable(): any {
  if (isBrowser) {
    return window;
  } else {
    // NativeScript uses global, not window
    return global;
  }
}
