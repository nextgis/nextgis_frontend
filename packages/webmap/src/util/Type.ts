import { Type } from '../interfaces/BaseTypes';

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}
