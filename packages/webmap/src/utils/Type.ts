export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export type Type<T> = new (...args: any[]) => T;
