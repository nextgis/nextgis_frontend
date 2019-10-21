import { WebMapEvents } from './Events';

/**
 * @module webmap
 */
export interface MapStateItem<V extends any = any> {
  event: keyof WebMapEvents;
  name: string;
  getValue: () => V;
  toString: (data: V) => string;
  parse: (str: string) => V;
}

export type MapState = MapStateItem[];
